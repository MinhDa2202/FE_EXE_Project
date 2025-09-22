import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PostManager from "./PostManager";

const PostManagerWrapper = () => {
  const { loginInfo } = useSelector((state) => state.user);
  const { isSignIn } = loginInfo;

  // Redirect to login if not signed in
  if (!isSignIn) {
    return <Navigate to="/login" replace />;
  }

  return <PostManager />;
};

export default PostManagerWrapper;
