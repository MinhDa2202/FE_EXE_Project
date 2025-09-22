import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const usePostApprovalStatus = (products) => {
  const [approvalStatuses, setApprovalStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginInfo = useSelector((state) => state.user.loginInfo);
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const checkApprovalStatus = async (productId) => {
    if (!token || !productId) return null;

    try {
      // Kiểm tra bài đã được duyệt
      const approvedResponse = await fetch(
        `/api/Post/${productId}/is-approved`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (approvedResponse.ok) {
        const isApproved = await approvedResponse.json();
        if (isApproved) {
          return "approved";
        }
      }

      // Kiểm tra bài đang chờ duyệt
      const pendingResponse = await fetch(`/api/Post/${productId}/is-pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (pendingResponse.ok) {
        const isPending = await pendingResponse.json();
        if (isPending) {
          return "pending";
        }
      }

      // Nếu không phải approved và không phải pending thì có thể là rejected
      return "rejected";
    } catch (error) {
      console.error("Error checking approval status:", error);
      return "unknown";
    }
  };

  const fetchAllApprovalStatuses = async () => {
    if (!products || products.length === 0) {
      setApprovalStatuses({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const statusPromises = products.map(async (product) => {
        const productId = product.Id || product.id;
        const status = await checkApprovalStatus(productId);
        return { productId, status };
      });

      const results = await Promise.all(statusPromises);

      const statusMap = {};
      results.forEach(({ productId, status }) => {
        statusMap[productId] = status;
      });

      setApprovalStatuses(statusMap);
    } catch (err) {
      setError("Không thể kiểm tra trạng thái duyệt bài");
      console.error("Error fetching approval statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products && products.length > 0 && token) {
      fetchAllApprovalStatuses();
    }
  }, [products, token]);

  // Tính toán số lượng bài đã duyệt và chờ duyệt
  const approvedCount = Object.values(approvalStatuses).filter(
    (status) => status === "approved"
  ).length;
  const pendingCount = Object.values(approvalStatuses).filter(
    (status) => status === "pending"
  ).length;

  return {
    approvalStatuses,
    loading,
    error,
    refetch: fetchAllApprovalStatuses,
    approvedCount,
    pendingCount,
  };
};

export default usePostApprovalStatus;
