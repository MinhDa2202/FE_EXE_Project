import About from "../Components/About/About";
import AccountPage from "../Components/AccountPage/AccountPage";
// import Cart from "../Components/Cart/Cart";
import ChatPage from "../Components/ChatPage/ChatPage";
// import CheckoutPage from "../Components/CheckoutPage/CheckoutPage";
import Contact from "../Components/Contact/Contact";
import DemoPage from "../Components/DemoPage/DemoPage";
import FavoritePage from "../Components/FavoritePage/FavoritePage";
import Home from "../Components/Home/Home";
import LogIn from "../Components/LogIn/LogIn";
import LuckySpinPage from "../Components/DemoPage/LuckySpinPage";
import MyReportsPage from "../Components/MyReportsPage/MyReportsPage";
import NotFoundPage from "../Components/NotFoundPage/NotFoundPage";
import OrderPage from "../Components/OrderPage/OrderPage";
import PaymentPage from "../Components/PaymentPage/PaymentPage";
import PostManagerWrapper from "../Components/PostManager/PostManagerWrapper";
import ProductDetailsPage from "../Components/ProductDetailsPage/ProductDetailsPage";
import ProductsCategoryPage from "../Components/ProductsCategory/ProductsCategoryPage";
import ProductsPage from "../Components/ProductsPage/ProductsPage";
import SearchPage from "../Components/Search/SearchPage";
import SignUp from "../Components/SignUp/SignUp";
import WishList from "../Components/WishList/WishList";
import PrivacyPolicy from "../Components/Legal/PrivacyPolicy";
import TermsOfUse from "../Components/Legal/TermsOfUse";
import ServiceTerms from "../Components/Legal/ServiceTerms";
import ReturnPolicy from "../Components/Legal/ReturnPolicy";
import FAQ from "../Components/Help/FAQ";
import Support from "../Components/Help/Support";

export const ROUTES_CONFIG = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <About /> },
  { path: "/demo", element: <DemoPage /> },
  { path: "/lucky-spin", element: <LuckySpinPage /> },
  { path: "/details", element: <ProductDetailsPage /> },
  { path: "/category", element: <ProductsCategoryPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/favorites", element: <FavoritePage /> },
  { path: "/wishlist", element: <WishList /> },
  { path: "/payment", element: <PaymentPage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/post-manager", element: <PostManagerWrapper /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/profile", element: <AccountPage /> },
  { path: "/profile/password", element: <AccountPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsOfUse /> },
  { path: "/service-terms", element: <ServiceTerms /> },
  { path: "/return-policy", element: <ReturnPolicy /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/support", element: <Support /> },
  { path: "/my-reports", element: <MyReportsPage /> },
  { path: "*", element: <NotFoundPage /> },
];
