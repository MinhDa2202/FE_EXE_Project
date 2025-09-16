// src/Components/ProductsPage/AddProductModal.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import s from "./AddProductModal.module.scss";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.user?.loginInfo?.token);
  const user = useSelector((state) => state.user?.loginInfo);
  const isSignedIn = useSelector((state) => state.user?.loginInfo?.isSignIn);

  const [formData, setFormData] = useState({
    title: "",
    descriptions: "",
    price: "",
    condition: "",
    locations: "",
    categoryId: ""
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() ? "" : "Tiêu đề là bắt buộc";
      case 'price':
        return value && parseFloat(value) > 0 ? "" : "Giá phải lớn hơn 0";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const processFiles = (files) => {
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Check total number of files (current + new)
    const totalFiles = imagePreviews.length + files.length;
    if (totalFiles > 10) {
      setError("Tối đa 10 ảnh cho mỗi sản phẩm");
      return;
    }

    // Add new files to existing ones
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    setError("");

    // Create preview URLs for new files
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    // Add new previews to existing ones
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    // Reset input value để có thể chọn lại cùng file
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index].url);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeAllImages = () => {
    // Revoke all URLs to prevent memory leaks
    imagePreviews.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });

    setSelectedFiles([]);
    setImagePreviews([]);
  };

  // Improved upload function with better error handling and progress tracking
  const uploadImages = async (productId) => {
    if (selectedFiles.length === 0) return;

    setUploadProgress(`Đang upload ${selectedFiles.length} ảnh...`);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`https://localhost:7235/api/ProductImage/upload-to-cloud/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Không set Content-Type khi upload file, để browser tự set
        },
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Không thể upload ảnh';
        
        if (response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (response.status === 403) {
          errorMessage = 'Bạn không có quyền upload ảnh';
        } else if (response.status === 413) {
          errorMessage = 'File quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB';
        } else if (response.status === 400) {
          errorMessage = 'Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, GIF';
        } else {
          try {
            const errorData = await response.text();
            console.log('Upload error response:', errorData);
            errorMessage = errorData || errorMessage;
          } catch (e) {
            console.log('Could not read upload error response:', e);
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      setUploadProgress(`Upload thành công ${selectedFiles.length} ảnh!`);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(''); // Clear progress on error
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");
    setUploadProgress("");

    if (!token || !isSignedIn) {
      setError("Bạn cần đăng nhập để thêm sản phẩm");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Giá phải lớn hơn 0";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create product
      setUploadProgress("Đang tạo sản phẩm...");

      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.categoryId) || 0
      };

      console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

      const productResponse = await fetch("https://localhost:7235/api/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!productResponse.ok) {
        let errorMessage = "Không thể tạo sản phẩm";

        if (productResponse.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (productResponse.status === 403) {
          errorMessage = "Bạn không có quyền thêm sản phẩm";
        } else if (productResponse.status === 400) {
          errorMessage = "Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.";
        } else {
          try {
            const errorData = await productResponse.text();
            console.log("Error response data:", errorData);
            errorMessage = errorData || errorMessage;
          } catch (textError) {
            console.log("Could not read error response:", textError);
          }
        }

        throw new Error(errorMessage);
      }

      const createdProduct = await productResponse.json();
      console.log("Product created successfully:", createdProduct);

      // Step 2: Upload images if any
      if (selectedFiles.length > 0) {
        console.log(`Uploading ${selectedFiles.length} images...`);
        try {
          await uploadImages(createdProduct.id);
          // Progress message already set in uploadImages function
        } catch (uploadError) {
          console.warn("Image upload failed, but product was created:", uploadError);
          setError(`Sản phẩm đã được tạo thành công, nhưng upload ảnh thất bại: ${uploadError.message}`);
          setUploadProgress("");
          
          // Still call onProductAdded because product was created successfully
          setTimeout(() => {
            onProductAdded();
          }, 2000);
          return;
        }
      } else {
        setUploadProgress("Thêm sản phẩm thành công!");
      }

      // Success - wait a moment to show success message then close
      setTimeout(() => {
        onProductAdded();
      }, 1000);

    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || "Đã xảy ra lỗi khi thêm sản phẩm");
      setUploadProgress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [imagePreviews]);

  // Show login required message
  if (!token) {
    return (
      <div className={s.modalOverlay}>
        <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={s.modalHeader}>
            <h2>{t("auth.loginRequired", "Yêu cầu đăng nhập")}</h2>
            <button className={s.closeButton} onClick={onClose}>
              ×
            </button>
          </div>
          <div className={s.loginRequired}>
            <p>Bạn cần đăng nhập để thêm sản phẩm mới.</p>
            <div className={s.formActions}>
              <button className={s.cancelButton} onClick={onClose}>
                {t("common.close", "Đóng")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>{t("products.addProduct", "Thêm sản phẩm mới")}</h2>
          <button className={s.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {/* Thông tin cơ bản */}
          <div className={s.formSection}>
            <h3 className={s.sectionTitle}>📝 Thông tin cơ bản</h3>
            
            <div className={s.formGroup}>
              <label htmlFor="title">
                {t("products.title", "Tiêu đề")} <span className={s.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                placeholder={t("products.titlePlaceholder", "Nhập tiêu đề sản phẩm")}
                className={validationErrors.title ? s.inputError : ''}
              />
              {validationErrors.title && (
                <div className={s.fieldError}>{validationErrors.title}</div>
              )}
            </div>

            <div className={s.formGroup}>
              <label htmlFor="descriptions">
                {t("products.description", "Mô tả")}
              </label>
              <textarea
                id="descriptions"
                name="descriptions"
                value={formData.descriptions}
                onChange={handleInputChange}
                rows="4"
                placeholder={t("products.descriptionsPlaceholder", "Nhập mô tả chi tiết về sản phẩm của bạn...")}
              />
            </div>
          </div>

          {/* Giá và danh mục */}
          <div className={s.formSection}>
            <h3 className={s.sectionTitle}>💰 Giá và phân loại</h3>
            
            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="price">
                  {t("products.price", "Giá")} <span className={s.required}>*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={validationErrors.price ? s.inputError : ''}
                />
                {validationErrors.price && (
                  <div className={s.fieldError}>{validationErrors.price}</div>
                )}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="categoryId">
                  {t("products.category", "Danh mục")}
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn danh mục</option>
                  <option value="1">💻 Laptop</option>
                  <option value="2">⌚ Smartwatch</option>
                  <option value="3">📱 Phone</option>
                </select>
              </div>
            </div>

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="condition">
                  {t("products.condition", "Tình trạng")}
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="">{t("products.selectCondition", "Chọn tình trạng")}</option>
                  <option value="new">✨ Mới</option>
                  <option value="used">🔄 Đã sử dụng</option>
                  <option value="refurbished">🛠️ Tân trang</option>
                </select>
              </div>

              <div className={s.formGroup}>
                <label htmlFor="locations">
                  {t("products.locations", "Vị trí")}
                </label>
                <input
                  type="text"
                  id="locations"
                  name="locations"
                  value={formData.locations}
                  onChange={handleInputChange}
                  placeholder={t("products.locationsPlaceholder", "Nhập vị trí của bạn")}
                />
              </div>
            </div>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className={s.formSection}>
            <h3 className={s.sectionTitle}>📸 Hình ảnh sản phẩm</h3>
            
            <div className={s.formGroup}>
              <div 
                className={`${s.imageUpload} ${isDragOver ? s.dragOver : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={s.fileInput}
                />
                <label htmlFor="images" className={s.fileLabel}>
                  <span className={s.uploadIcon}>📷</span>
                  <span className={s.uploadText}>
                    {isDragOver ? 'Thả ảnh vào đây' : 'Kéo thả ảnh hoặc nhấp để chọn'}
                  </span>
                  <span className={s.fileHint}>
                    Hỗ trợ JPEG, PNG, GIF • Tối đa 5MB mỗi file • Có thể chọn nhiều ảnh (tối đa 10 ảnh)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className={s.imagePreviewContainer}>
              <div className={s.imagePreviewHeader}>
                <h4>Ảnh đã chọn ({imagePreviews.length}/10):</h4>
                <button
                  type="button"
                  className={s.removeAllButton}
                  onClick={removeAllImages}
                  title="Xóa tất cả ảnh"
                >
                  🗑️ Xóa tất cả
                </button>
              </div>
              <div className={s.imagePreviewGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={s.imagePreview}>
                    <img src={preview.url} alt={preview.name} />
                    <button
                      type="button"
                      className={s.removeImage}
                      onClick={() => removeImage(index)}
                      title={`Xóa ${preview.name}`}
                    >
                      ×
                    </button>
                    <span className={s.imageName}>{preview.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Message */}
          {uploadProgress && (
            <div className={s.uploadProgress}>
              {uploadProgress}
            </div>
          )}

          {error && (
            <div className={s.error}>
              {error}
            </div>
          )}

          <div className={s.formActions}>
            <button
              type="button"
              className={s.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("common.cancel", "Hủy")}
            </button>
            <button
              type="submit"
              className={s.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("common.adding", "Đang thêm...")
                : t("products.addProduct", "Thêm sản phẩm")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;