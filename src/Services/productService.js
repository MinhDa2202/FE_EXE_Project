const BASE_URL = "/api/Product";

// Cache for user products to avoid repeated API calls
let userProductsCache = {
  userId: null,
  products: [],
  timestamp: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes cache
};

const productService = {
  // Get all products for the current user using Post API only
  getUserProducts: async (userInfo) => {
    try {
      console.log(
        "ProductService - getUserProducts called with userInfo:",
        userInfo
      );

      // Extract userId from JWT token
      const userId = productService.extractUserIdFromToken(userInfo.token);
      console.log("ProductService - Extracted userId from token:", userId);

      if (!userId) {
        console.log("ProductService - No userId found, returning empty array");
        return [];
      }

      // Check cache first
      const now = Date.now();
      if (
        userProductsCache.userId === userId &&
        userProductsCache.timestamp &&
        now - userProductsCache.timestamp < userProductsCache.cacheTimeout
      ) {
        console.log(
          "ProductService - Returning cached products for user:",
          userId
        );
        return userProductsCache.products.map((product) =>
          productService.formatProductForDisplay(product)
        );
      }

      console.log(
        "ProductService - Using optimized Post API to get user's products..."
      );

      // Optimized approach: Use batch requests and smart scanning
      const foundProducts = [];
      const processedProductIds = new Set(); // Track processed product IDs to avoid duplicates
      const maxProductId = 50; // Scan up to product ID 50
      const batchSize = 5; // Process 5 products at a time
      let consecutiveNotFound = 0;
      const maxConsecutiveNotFound = 20; // Stop if 20 consecutive products not found (increased to find products 13, 16)

      // Process products in batches for better performance
      for (let startId = 1; startId <= maxProductId; startId += batchSize) {
        const endId = Math.min(startId + batchSize - 1, maxProductId);
        console.log(`ProductService - Processing batch ${startId}-${endId}`);

        // Create batch of promises for both approved and pending
        const batchPromises = [];

        for (let productId = startId; productId <= endId; productId++) {
          // Add approved product promise
          batchPromises.push(
            fetch(`/api/Post/${productId}/is-approved`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
              },
            })
              .then(async (response) => {
                if (response.ok) {
                  const product = await response.json();
                  return { type: "approved", productId, product };
                }
                return null;
              })
              .catch(() => null)
          );

          // Add pending product promise
          batchPromises.push(
            fetch(`/api/Post/${productId}/is-pending`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
              },
            })
              .then(async (response) => {
                if (response.ok) {
                  const product = await response.json();
                  return { type: "pending", productId, product };
                }
                return null;
              })
              .catch(() => null)
          );
        }

        // Wait for all batch promises to complete
        const batchResults = await Promise.all(batchPromises);

        // Process results and fetch full product details
        let foundInBatch = false;
        for (const result of batchResults) {
          if (result && result.product) {
            const { type, productId, product } = result;

            // Skip if this product ID has already been processed
            if (processedProductIds.has(productId)) {
              console.log(
                `ProductService - Product ${productId} already processed, skipping duplicate`
              );
              continue;
            }

            console.log(
              `ProductService - Found ${type} product ${productId}:`,
              product
            );
            console.log(
              `ProductService - ${type} product ${productId} sellerId: ${product.sellerId}, current userId: ${userId}`
            );

            // Only add product if it belongs to the current user
            if (
              product.sellerId &&
              product.sellerId.toString() === userId.toString()
            ) {
              console.log(
                `ProductService - ${type} product ${productId} belongs to user ${userId}, fetching full details`
              );

              // Mark this product ID as processed
              processedProductIds.add(productId);

              // Fetch full product details including images
              try {
                const productDetailResponse = await fetch(
                  `/api/Product/${productId}`
                );
                if (productDetailResponse.ok) {
                  const fullProductData = await productDetailResponse.json();
                  console.log(
                    `ProductService - Full product ${productId} data:`,
                    fullProductData
                  );

                  // Merge approval status with full product data
                  const productWithImages = {
                    ...fullProductData,
                    approvalStatus: type,
                    imageUrls:
                      fullProductData.imageUrls ||
                      fullProductData.ImageUrls ||
                      [],
                  };

                  console.log(
                    `ProductService - Product ${productId} final imageUrls:`,
                    productWithImages.imageUrls
                  );

                  foundProducts.push(productWithImages);
                } else {
                  // Fallback to original product data if detail fetch fails
                  foundProducts.push({
                    ...product,
                    approvalStatus: type,
                    imageUrls: product.imageUrls || product.ImageUrls || [],
                  });
                }
              } catch (error) {
                console.error(
                  `ProductService - Error fetching full details for product ${productId}:`,
                  error
                );
                // Fallback to original product data
                foundProducts.push({
                  ...product,
                  approvalStatus: type,
                  imageUrls: product.imageUrls || product.ImageUrls || [],
                });
              }

              foundInBatch = true;
              consecutiveNotFound = 0; // Reset counter
            } else {
              console.log(
                `ProductService - ${type} product ${productId} belongs to user ${product.sellerId}, skipping (current user: ${userId})`
              );
            }
          }
        }

        // Update consecutive not found counter
        if (!foundInBatch) {
          consecutiveNotFound += batchSize;
          console.log(
            `ProductService - No products found in batch ${startId}-${endId}, consecutive not found: ${consecutiveNotFound}`
          );

          // Early termination if too many consecutive products not found
          if (consecutiveNotFound >= maxConsecutiveNotFound) {
            console.log(
              `ProductService - Early termination: ${consecutiveNotFound} consecutive products not found`
            );
            break;
          }
        }

        // Small delay between batches to avoid overwhelming the server
        if (startId + batchSize <= maxProductId) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      console.log(
        "ProductService - Found products via optimized Post API:",
        foundProducts
      );

      console.log(
        "ProductService - Total user products found:",
        foundProducts.length
      );

      // Update cache
      userProductsCache = {
        userId: userId,
        products: foundProducts,
        timestamp: Date.now(),
        cacheTimeout: userProductsCache.cacheTimeout,
      };
      console.log("ProductService - Updated cache for user:", userId);

      return foundProducts.map((product) =>
        productService.formatProductForDisplay(product)
      );
    } catch (error) {
      console.error("ProductService - Error in getUserProducts:", error);
      return [];
    }
  },

  // Clear user products cache
  clearUserProductsCache: () => {
    console.log("ProductService - Clearing user products cache");
    userProductsCache = {
      userId: null,
      products: [],
      timestamp: null,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes cache
    };
  },

  // Extract user ID from JWT token
  extractUserIdFromToken: (token) => {
    try {
      if (!token) {
        console.log("ProductService - No token provided");
        return null;
      }

      // Decode JWT token (simple base64 decode of payload)
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.log("ProductService - Invalid token format");
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log("ProductService - JWT payload:", payload);

      // Try different possible field names for user ID
      const userId = payload.UserId || payload.userId || payload.sub;
      console.log("ProductService - Extracted userId:", userId);

      return userId;
    } catch (error) {
      console.error(
        "ProductService - Error extracting userId from token:",
        error
      );
      return null;
    }
  },

  // Format product data for display
  formatProductForDisplay: (product) => {
    return {
      id: product.id,
      title: product.title,
      descriptions: product.descriptions,
      price: product.price,
      condition: product.condition,
      locations: product.locations,
      sellerId: product.sellerId,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      isApproved: product.isApproved,
      approvedAt: product.approvedAt,
      rejectedReason: product.rejectedReason,
      isSold: product.isSold,
      soldAt: product.soldAt,
      expireAt: product.expireAt,
      boostedUntil: product.boostedUntil,
      imageUrls: product.imageUrls || [],
      sellerName: product.sellerName,
      // Add approval status based on product properties
      approvalStatus: productService.determineApprovalStatus(product),
    };
  },

  // Determine approval status based on product properties
  determineApprovalStatus: (product) => {
    try {
      console.log("ProductService - determineApprovalStatus for product:", {
        id: product.id,
        isActive: product.isActive,
        isApproved: product.isApproved,
        createdAt: product.createdAt,
      });

      if (product.isApproved === true) {
        console.log(
          `ProductService - Product isApproved = true , status: approved`
        );
        return "approved";
      } else if (product.isApproved === false) {
        console.log(
          `ProductService - Product isApproved = false , status: pending`
        );
        return "pending";
      } else {
        // Fallback logic
        const defaultStatus = product.isActive ? "approved" : "pending";
        console.log("ProductService - Using fallback status:", defaultStatus);
        return defaultStatus;
      }
    } catch (error) {
      console.error(
        "ProductService - Error determining approval status:",
        error
      );
      const defaultStatus = "pending";
      console.log("ProductService - Using default status:", defaultStatus);
      return defaultStatus;
    }
  },
};

export default productService;
