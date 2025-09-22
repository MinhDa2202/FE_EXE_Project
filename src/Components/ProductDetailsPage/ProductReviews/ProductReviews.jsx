import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { productCommentService } from "src/Services/productCommentService";
import { productReviewService } from "src/Services/productReviewService";
import s from "./ProductReviews.module.scss";

const ProductReviews = ({ productId }) => {
  const { t } = useTranslation();
  const { loginInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("reviews");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [newComment, setNewComment] = useState("");

  // API state for comments
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // API state for reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Load comments and reviews when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      loadComments();
      loadReviews();
    }
  }, [productId]);

  const loadComments = async () => {
    setLoadingComments(true);
    setCommentError(null);
    try {
      const rawComments = await productCommentService.getProductComments(
        productId
      );
      const organizedComments =
        productCommentService.organizeCommentsIntoThreads(rawComments);
      const formattedComments = organizedComments.map((comment) =>
        productCommentService.formatCommentForDisplay(comment)
      );
      setComments(formattedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      setCommentError("Không thể tải bình luận. Vui lòng thử lại sau.");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadReviews = async () => {
    console.log("loadReviews called for productId:", productId);
    setLoadingReviews(true);
    setReviewError(null);
    try {
      const rawReviews = await productReviewService.getProductReviews(
        productId
      );
      console.log("Raw reviews received:", rawReviews);

      if (!Array.isArray(rawReviews)) {
        console.error("Reviews response is not an array:", rawReviews);
        setReviews([]);
        return;
      }

      const formattedReviews = rawReviews.map((review) =>
        productReviewService.formatReviewForDisplay(review)
      );
      console.log("Formatted reviews:", formattedReviews);
      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      console.error("Error stack:", error.stack);
      setReviewError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!loginInfo.isSignIn) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    // Validate review data
    const validation = productReviewService.validateReviewData(
      newReview.rating,
      newReview.comment,
      newReview.title
    );

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const reviewData = productReviewService.formatReviewForSubmission(
        productId,
        newReview.rating,
        newReview.comment,
        newReview.title
      );

      await productReviewService.createReview(reviewData);
      setNewReview({ rating: 5, title: "", comment: "" });

      // Reload reviews to show the new review
      await loadReviews();

      alert("Đánh giá đã được gửi thành công!");
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("Không thể gửi đánh giá. Vui lòng thử lại sau.");
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!loginInfo.isSignIn) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận");
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const commentData = productCommentService.formatCommentForSubmission(
        productId,
        newComment
      );

      await productCommentService.createComment(commentData);
      setNewComment("");

      // Reload comments to show the new comment
      await loadComments();

      alert("Bình luận đã được gửi thành công!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError("Không thể gửi bình luận. Vui lòng thử lại sau.");
      alert("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className={s.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${s.star} ${star <= rating ? s.filled : ""} ${
              interactive ? s.interactive : ""
            }`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    return productReviewService.calculateAverageRating(reviews);
  };

  const getRatingDistribution = () => {
    return productReviewService.getRatingDistribution(reviews);
  };

  return (
    <div className={s.productReviews}>
      {/* Tab Navigation */}
      <div className={s.tabNavigation}>
        <button
          className={`${s.tabButton} ${
            activeTab === "reviews" ? s.active : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          <span className={s.tabIcon}>⭐</span>
          Đánh giá ({reviews.length})
        </button>
        <button
          className={`${s.tabButton} ${
            activeTab === "comments" ? s.active : ""
          }`}
          onClick={() => setActiveTab("comments")}
        >
          <span className={s.tabIcon}>💬</span>
          Bình luận ({comments.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className={s.reviewsTab}>
          {/* Rating Summary */}
          <div className={s.ratingSummary}>
            <div className={s.averageRating}>
              <div className={s.ratingNumber}>{calculateAverageRating()}</div>
              {renderStars(Math.round(calculateAverageRating()))}
              <div className={s.totalReviews}>
                Dựa trên {reviews.length} đánh giá
              </div>
            </div>

            <div className={s.ratingDistribution}>
              {Object.entries(getRatingDistribution())
                .reverse()
                .map(([rating, count]) => (
                  <div key={rating} className={s.ratingBar}>
                    <span className={s.ratingLabel}>{rating} sao</span>
                    <div className={s.barContainer}>
                      <div
                        className={s.bar}
                        style={{
                          width: `${
                            reviews.length > 0
                              ? (count / reviews.length) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className={s.ratingCount}>({count})</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Write Review Form */}
          {loginInfo.isSignIn && (
            <div className={s.writeReview}>
              <h3>Viết đánh giá của bạn</h3>
              <form onSubmit={handleSubmitReview} className={s.reviewForm}>
                <div className={s.ratingInput}>
                  <label>Đánh giá của bạn:</label>
                  {renderStars(newReview.rating, true, (rating) =>
                    setNewReview({ ...newReview, rating })
                  )}
                </div>

                <div className={s.inputGroup}>
                  <label htmlFor="reviewTitle">Tiêu đề đánh giá:</label>
                  <input
                    type="text"
                    id="reviewTitle"
                    value={newReview.title}
                    onChange={(e) =>
                      setNewReview({ ...newReview, title: e.target.value })
                    }
                    placeholder="Nhập tiêu đề cho đánh giá của bạn"
                    required
                  />
                </div>

                <div className={s.inputGroup}>
                  <label htmlFor="reviewComment">Nội dung đánh giá:</label>
                  <textarea
                    id="reviewComment"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={s.submitButton}
                  disabled={submittingReview}
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {reviewError && (
            <div className={s.errorMessage}>
              <p>{reviewError}</p>
              <button onClick={loadReviews}>Thử lại</button>
            </div>
          )}

          {/* Loading State */}
          {loadingReviews && (
            <div className={s.loadingMessage}>
              <p>Đang tải đánh giá...</p>
            </div>
          )}

          {/* Reviews List */}
          <div className={s.reviewsList}>
            {!loadingReviews && reviews.length === 0 && !reviewError && (
              <div className={s.noComments}>
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                <p>Hãy là người đầu tiên đánh giá sản phẩm!</p>
              </div>
            )}

            {reviews.map((review) => (
              <div key={review.id} className={s.reviewItem}>
                <div className={s.reviewHeader}>
                  <div className={s.userInfo}>
                    <div className={s.avatar}>
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.userName} />
                      ) : (
                        <span>{review.userName.charAt(0)}</span>
                      )}
                    </div>
                    <div className={s.userDetails}>
                      <div className={s.userName}>{review.userName}</div>
                      <div className={s.reviewDate}>{review.date}</div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <div className={s.reviewContent}>
                  <h4 className={s.reviewTitle}>{review.title}</h4>
                  <p className={s.reviewComment}>{review.comment}</p>
                </div>

                <div className={s.reviewActions}>
                  <button className={s.helpfulButton}>
                    👍 Hữu ích ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className={s.commentsTab}>
          {/* Write Comment Form */}
          {loginInfo.isSignIn && (
            <div className={s.writeComment}>
              <h3>Đặt câu hỏi về sản phẩm</h3>
              <form onSubmit={handleSubmitComment} className={s.commentForm}>
                <div className={s.inputGroup}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Đặt câu hỏi về sản phẩm, chúng tôi sẽ trả lời sớm nhất có thể"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={s.submitButton}
                  disabled={submittingComment}
                >
                  {submittingComment ? "Đang gửi..." : "Gửi câu hỏi"}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {commentError && (
            <div className={s.errorMessage}>
              <p>{commentError}</p>
              <button onClick={loadComments}>Thử lại</button>
            </div>
          )}

          {/* Loading State */}
          {loadingComments && (
            <div className={s.loadingMessage}>
              <p>Đang tải bình luận...</p>
            </div>
          )}

          {/* Comments List */}
          <div className={s.commentsList}>
            {!loadingComments && comments.length === 0 && !commentError && (
              <div className={s.noComments}>
                <p>Chưa có bình luận nào cho sản phẩm này.</p>
                <p>Hãy là người đầu tiên đặt câu hỏi!</p>
              </div>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className={s.commentItem}>
                <div className={s.commentHeader}>
                  <div className={s.userInfo}>
                    <div className={s.avatar}>
                      <span>{comment.userName.charAt(0)}</span>
                    </div>
                    <div className={s.userDetails}>
                      <div className={s.userName}>{comment.userName}</div>
                      <div className={s.commentDate}>{comment.date}</div>
                    </div>
                  </div>
                </div>

                <div className={s.commentContent}>
                  <p>{comment.comment}</p>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className={s.replies}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className={s.replyItem}>
                        <div className={s.commentHeader}>
                          <div className={s.userInfo}>
                            <div
                              className={`${s.avatar} ${
                                reply.isAdmin ? s.adminAvatar : ""
                              }`}
                            >
                              <span>{reply.userName.charAt(0)}</span>
                            </div>
                            <div className={s.userDetails}>
                              <div className={s.userName}>
                                {reply.userName}
                                {reply.isAdmin && (
                                  <span className={s.adminBadge}>Admin</span>
                                )}
                              </div>
                              <div className={s.commentDate}>{reply.date}</div>
                            </div>
                          </div>
                        </div>
                        <div className={s.commentContent}>
                          <p>{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login Prompt for non-logged users */}
      {!loginInfo.isSignIn && (
        <div className={s.loginPrompt}>
          <p>
            <a href="/login">Đăng nhập</a> để viết đánh giá và bình luận về sản
            phẩm
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
