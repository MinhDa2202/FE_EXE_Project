const BASE_URL = "https://schand20250922153400.azurewebsites.net/api/Product";

const productService = {
  // Get all products for the current user
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

      // Collect all user products from multiple sources
      const allUserProducts = [];

      // Get all products from Product API and check each one dynamically
      console.log(
        "ProductService - Getting all products to find user's products..."
      );
      try {
        // Get all products from Product API first
        const allProductsResponse = await fetch("https://schand20250922153400.azurewebsites.net/api/Product", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        });

        if (allProductsResponse.ok) {
          const allProducts = await allProductsResponse.json();
          console.log(
            "ProductService - All products from Product API:",
            allProducts
          );

          // Check each product to see if it belongs to current user
          for (const product of allProducts) {
            try {
              const productId = product.id || product.Id;
              console.log(`ProductService - Checking product ${productId}...`);

              const detailResponse = await fetch(`https://schand20250922153400.azurewebsites.net/api/Product/${productId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                  "Content-Type": "application/json",
                },
              });

              if (detailResponse.ok) {
                const productDetail = await detailResponse.json();

                // Check if this product belongs to current user
                if (productDetail.sellerName && userInfo.username) {
                  const sellerNameMatch =
                    productDetail.sellerName.toLowerCase() ===
                    userInfo.username.toLowerCase();

                  if (sellerNameMatch) {
                    console.log(
                      `ProductService - Product ${productId} belongs to user, checking Post API...`
                    );

                    // Try to get Post API data for accurate approval status
                    try {
                      const postResponse = await fetch(
                        `/api/Post/${productId}/is-pending`,
                        {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      if (postResponse.ok) {
                        const postData = await postResponse.json();
                        console.log(
                          `ProductService - Post data for product ${productId}:`,
                          postData
                        );

                        // Use Post API data (has accurate isApproved)
                        allUserProducts.push(postData);
                      } else {
                        console.log(
                          `ProductService - Post API failed for product ${productId}, using Product data`
                        );
                        // Fallback to Product API data
                        allUserProducts.push({
                          ...productDetail,
                          sellerId: userId,
                          isApproved: productDetail.isActive, // Use isActive as fallback
                        });
                      }
                    } catch (postError) {
                      console.log(
                        `ProductService - Post API error for product ${productId}:`,
                        postError
                      );
                      // Fallback to Product API data
                      allUserProducts.push({
                        ...productDetail,
                        sellerId: userId,
                        isApproved: productDetail.isActive, // Use isActive as fallback
                      });
                    }
                  }
                }
              }
            } catch (error) {
              console.error(
                `ProductService - Error processing product ${product.id}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error("ProductService - Error getting all products:", error);
      }

      // Use Post API to get both approved and pending products
      console.log("ProductService - Using Post API to get user's products...");

      try {
        // Get all products from Product API first (these are approved products)
        const approvedProductIds = allUserProducts.map((p) => p.id);
        console.log(
          "ProductService - Already found approved products:",
          approvedProductIds
        );

        // Now scan through product IDs to find both approved and pending products using Post API
        const maxProductId = 50; // Scan up to product ID 50
        const foundProducts = [];

        for (let productId = 1; productId <= maxProductId; productId++) {
          try {
            // Try to get approved product first
            const approvedResponse = await fetch(
              `/api/Post/${productId}/is-approved`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (approvedResponse.ok) {
              const isApproved = await approvedResponse.json();
              if (isApproved === true) {
                console.log(
                  `ProductService - Product ${productId} is approved and belongs to user`
                );

                // Get full product data
                const productResponse = await fetch(
                  `https://schand20250922153400.azurewebsites.net/api/Product/${productId}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${userInfo.token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  foundProducts.push({
                    ...productData,
                    sellerId: userId,
                    isApproved: true,
                  });
                }
              }
            }

            // Try to get pending product
            const pendingResponse = await fetch(
              `/api/Post/${productId}/is-pending`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (pendingResponse.ok) {
              const pendingProduct = await pendingResponse.json();
              console.log(
                `ProductService - Product ${productId} is pending and belongs to user:`,
                pendingProduct
              );

              foundProducts.push({
                ...pendingProduct,
                sellerId: userId,
                isApproved: false,
              });
            }
          } catch (error) {
            // Ignore errors for individual products
            console.log(
              `ProductService - No product ${productId} for user or error:`,
              error.message
            );
          }
        }

        console.log(
          "ProductService - Found products via Post API:",
          foundProducts
        );

        // Add new products to collection (avoid duplicates)
        const existingProductIds = allUserProducts.map((p) => p.id);
        const newProducts = foundProducts.filter(
          (p) => !existingProductIds.includes(p.id)
        );

        console.log(
          `ProductService - Adding ${newProducts.length} new products from Post API`
        );
        allUserProducts.push(...newProducts);
      } catch (error) {
        console.log("ProductService - Error using Post API:", error);
      }

      console.log(
        "ProductService - Final user products collection:",
        allUserProducts
      );
      console.log(
        "ProductService - Total user products found:",
        allUserProducts.length
      );

      return allUserProducts;
    } catch (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }
  },

  // Extract userId from JWT token
  extractUserIdFromToken: (token) => {
    try {
      if (!token) return null;

      // JWT tokens have 3 parts separated by dots
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      console.log("ProductService - JWT payload:", payload);

      // Extract userId from the payload
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
    };
  },

  // Determine approval status based on product data
  determineApprovalStatus: (product) => {
    console.log("ProductService - determineApprovalStatus for product:", {
      id: product.id,
      isActive: product.isActive,
      isApproved: product.isApproved,
      createdAt: product.createdAt,
    });

    // If isApproved is explicitly set, use it
    if (product.isApproved !== undefined && product.isApproved !== null) {
      const status = product.isApproved ? "approved" : "pending";
      console.log(
        `ProductService - Product isApproved = ${product.isApproved} , status: ${status}`
      );
      return status;
    }

    // Fallback logic based on isActive and creation time
    if (product.isActive === false) {
      console.log(
        "ProductService - Product isActive = false, status: rejected"
      );
      return "rejected";
    }

    // If created recently (within last 24 hours) and no explicit approval status
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);

    if (hoursSinceCreation < 24) {
      console.log(
        `ProductService - Product created ${hoursSinceCreation.toFixed(
          1
        )} hours ago, status: pending`
      );
      return "pending";
    }

    // Default to approved for older products that are active
    console.log("ProductService - Default status: approved");
    return "approved";
  },

  // Format product data for display
  formatProductForDisplay: (product) => {
    return {
      id: product.id || product.Id,
      title: product.title || product.Title,
      description: product.descriptions || product.Description,
      price: product.price || product.Price,
      condition: product.condition || product.Condition,
      location: product.locations || product.Location,
      categoryId: product.categoryId || product.CategoryId,
      categoryName: product.categoryName,
      sellerId: product.sellerId,
      userId: product.sellerId || product.userId || product.UserId,
      userName: product.sellerName || product.userName || product.UserName,
      userEmail: product.userEmail || product.UserEmail,
      createdAt: product.createdAt || product.CreatedAt,
      updatedAt: product.updatedAt || product.UpdatedAt,
      isActive: product.isActive,
      isApproved: product.isApproved,
      approvedAt: product.approvedAt,
      rejectedReason: product.rejectedReason,
      isSold: product.isSold,
      soldAt: product.soldAt,
      expireAt: product.expireAt,
      boostedUntil: product.boostedUntil,
      imageUrls: product.imageUrls || product.productImages || [],
      // Add approval status based on product properties
      approvalStatus: productService.determineApprovalStatus(product),
    };
  },

  // Determine approval status based on product data
  determineApprovalStatus: (product) => {
    console.log("ProductService - determineApprovalStatus for product:", {
      id: product.id,
      isActive: product.isActive,
      isApproved: product.isApproved,
      createdAt: product.createdAt,
    });

    // If isApproved field exists, use it directly
    if (typeof product.isApproved === "boolean") {
      const status = product.isApproved ? "approved" : "pending";
      console.log(
        "ProductService - Product isApproved =",
        product.isApproved,
        ", status:",
        status
      );
      return status;
    }

    // Fallback logic based on isActive and other fields
    if (product.isActive === true) {
      console.log("ProductService - Product isActive = true, status: approved");
      return "approved";
    } else if (product.isActive === false) {
      console.log("ProductService - Product isActive = false, status: pending");
      return "pending";
    }

    // Default fallback
    const defaultStatus = "pending";
    console.log("ProductService - Using default status:", defaultStatus);
    return defaultStatus;
  },
};

export default productService;
