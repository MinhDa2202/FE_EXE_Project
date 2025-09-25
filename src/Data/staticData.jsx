import {
  appleLogo,
  bkashCard,
  canonLogo,
  mastercard,
  member1Img,
  member2Img,
  member3Img,
  nagadCard,
  gamingLaptop,
  productImg2,
  productImg3,
  russiaFlag,
  saudiFlag,
  usaFlag,
  visaCard,
} from "src/Assets/Images/Images";
import {
  car,
  correctSign,
  franceFlag,
  headphone,
  hungaryFlag,
  indiaFlag,
  japanFlag,
} from "../Assets/Images/Images";
import { regexPatterns } from "./globalVariables";

export const introductionSliderData = [
  {
    productName: "Máy tính xách tay chơi game Pro",
    productImg: gamingLaptop,
    logoImg: appleLogo,
    discountText: "Giảm giá tới 30% Voucher",
    id: 1,
  },
  {
    productName: "Canon EOS 5D MkII",
    productImg: productImg2,
    logoImg: canonLogo,
    discountText: "Giảm giá tới 30% Voucher",
    id: 2,
  },
  {
    productName: "MacBook Pro 16",
    productImg: productImg3,
    logoImg: appleLogo,
    discountText: "Giảm giá tới 15% Voucher",
    id: 3,
  },
];

export const aboutCardsInfo = [
  {
    iconName: "shop",
    number: "10.5k",
    text: "Người bán hoạt động trên trang web của chúng tôi",
    translationKey: "aboutCardsInfo1",
    id: 1,
  },
  {
    iconName: "dollarSign",
    number: "33k",
    text: "Doanh số sản phẩm hàng tháng",
    translationKey: "aboutCardsInfo2",
    id: 2,
  },
  {
    iconName: "shoppingBag",
    number: "45.5k",
    text: "Khách hàng hoạt động trên trang web của chúng tôi",
    translationKey: "aboutCardsInfo3",
    id: 3,
  },
  {
    iconName: "moneyBag",
    number: "25k",
    text: "Tổng doanh thu hàng năm trên trang web của chúng tôi",
    translationKey: "aboutCardsInfo4",
    id: 4,
  },
];

export const ourMembersData = [
  {
    name: "Tom Cruise",
    jobTitle: "Người sáng lập & Chủ tịch",
    img: member1Img,
    socialMedia: {
      twitter: "https://twitter.com/",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
    },
    id: 1,
  },

  {
    name: "Emma Watson",
    jobTitle: "Giám đốc điều hành",
    img: member2Img,
    socialMedia: {
      twitter: "https://twitter.com/",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
    },
    id: 2,
  },

  {
    name: "Will Smith",
    jobTitle: "Thiết kế sản phẩm",
    img: member3Img,
    socialMedia: {
      twitter: "https://twitter.com/",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
    },
    id: 3,
  },
];

export const paymentCards = [
  {
    img: bkashCard,
    alt: "Thẻ Bkash",
    link: "https://www.bkash.com/en/products-services/visa-card-to-bkash",
    id: 1,
  },
  {
    img: visaCard,
    alt: "Thẻ Visa",
    link: "https://usa.visa.com/pay-with-visa/find-card/apply-credit-card",
    id: 2,
  },
  {
    img: mastercard,
    alt: "Thẻ Mastercard",
    link: "https://www.mastercard.us/en-us.html",
    id: 3,
  },
  {
    img: nagadCard,
    alt: "Thẻ Nagad",
    link: "https://www.nagad.com.bd/services/?service=add-money-from-card",
    id: 4,
  },
];

export const LANGUAGES = [
  {
    lang: "Tiếng Việt",
    flag: usaFlag,
    flagName: "Việt Nam",
    code: "vi",
    id: 1,
  },
  {
    lang: "Tiếng Nga",
    flag: russiaFlag,
    flagName: "Nga",
    code: "ru",
    id: 2,
  },
  {
    lang: "Tiếng Ả Rập",
    flag: saudiFlag,
    flagName: "Ả Rập Xê Út",
    code: "ar",
    id: 3,
  },
  {
    lang: "Tiếng Pháp",
    flag: franceFlag,
    flagName: "Pháp",
    code: "fr",
    id: 4,
  },
  {
    lang: "Tiếng Hungary",
    flag: hungaryFlag,
    flagName: "Hungary",
    code: "hu",
    id: 5,
  },
  {
    lang: "Tiếng Nhật",
    flag: japanFlag,
    flagName: "Nhật Bản",
    code: "ja",
    id: 6,
  },
  {
    lang: "Tiếng Hindi",
    flag: indiaFlag,
    flagName: "Ấn Độ",
    code: "hi",
    id: 7,
  },
];

export const productCardCustomizations = {
  categoryProducts: {
    showDiscount: true,
    showFavIcon: true,
    showDetailsIcon: true,
    showNewText: true,
    showWishList: true,
  },
  allProducts: {
    showDiscount: true,
    showFavIcon: true,
    showDetailsIcon: true,
    showNewText: true,
    showWishList: true,
  },
  wishListProducts: {
    showDiscount: true,
    showFavIcon: false,
    stopHover: true,
    showDetailsIcon: false,
    showRemoveIcon: true,
  },
  ourProducts: {
    showDiscount: true,
    showFavIcon: true,
    stopHover: false,
    showDetailsIcon: true,
    showRemoveIcon: false,
    showNewText: true,
    showWishList: true,
    showColors: true,
  },
};

export const mobileNavData = [
  {
    name: "Trang chủ",
    link: "/",
    icon: "home",
    requiteSignIn: false,
  },
  {
    name: "Về chúng tôi",
    link: "/about",
    icon: "filePaper",
    requiteSignIn: false,
  },
  {
    name: "Quản lý bài đăng",
    link: "/post-manager",
    icon: "filePaper",
    requiteSignIn: true,
  },
  {
    name: "Hồ sơ",
    link: "/profile",
    icon: "user",
    requiteSignIn: true,
  },
];

export const getRestMobileNavData = ({
  orderProducts = [],
  favoritesProducts = [],
  wishList = [],
}) => {
  return [
    {
      iconName: "cart",
      routePath: "/order",
      text: "đơn hàng của tôi",
      countLength: orderProducts?.length || 0,
      id: mobileNavData.length + 2,
    },
    {
      iconName: "heart",
      routePath: "/favorites",
      text: "yêu thích",
      countLength: favoritesProducts?.length || 0,
      id: mobileNavData.length + 3,
    },
    {
      iconName: "save",
      routePath: "/wishlist",
      text: "danh sách yêu thích",
      countLength: wishList?.length || 0,
      id: mobileNavData.length + 4,
    },
  ];
};

export const womenFashionMenuItems = [
  { name: "Đầm thanh lịch", url: "/#" },
  { name: "Áo kiểu sang trọng", url: "/#" },
  { name: "Túi xách nổi bật", url: "/#" },
  { name: "Áo khoác đa năng", url: "/#" },
  { name: "Thoải mái", url: "/#" },
];

export const menFashionMenuItems = [
  { name: "Bộ vest may đo", url: "/#" },
  { name: "Áo sơ mi thường ngày", url: "/#" },
  { name: "Quần jean ôm", url: "/#" },
  { name: "Phụ kiện da", url: "/#" },
  { name: "Giày thể thao hiện đại", url: "/#" },
];

export const otherSectionsMenuItems = [
  { name: "Điện tử", url: "/#" },
  { name: "Nhà cửa & Phong cách sống", url: "/#" },
  { name: "Y tế", url: "/#" },
  { name: "Thể thao & Ngoài trời", url: "/#" },
  { name: "Đồ dùng cho bé & Đồ chơi", url: "/#" },
  { name: "Thực phẩm & Thú cưng", url: "/#" },
  { name: "Sức khỏe & Sắc đẹp", url: "/#" },
];

export const mySocialMedia = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/MoamalAlaa109",
    icon: "facebook",
    id: 1,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/MoamalAlaa7",
    icon: "twitter",
    id: 2,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/kubislav23/",
    icon: "instagram",
    id: 3,
  },
  {
    name: "Linkedin",
    link: "https://www.linkedin.com/in/moamal-alaa-a4bb15237/",
    icon: "linkedin",
    id: 4,
  },
];

export const billingInputsData = [
  {
    translationKey: "firstName",
    label: "Tên",
    name: "firstName",
    required: true,
    id: 1,
  },
  {
    translationKey: "companyName",
    label: "Tên công ty",
    name: "companyName",
    id: 2,
  },
  {
    translationKey: "streetAddress",
    label: "Địa chỉ đường",
    name: "streetAddress",
    required: true,
    autoComplete: true,
    id: 3,
  },
  {
    translationKey: "apartment",
    label: "Căn hộ, tầng, v.v. (tùy chọn)",
    name: "address",
    autoComplete: true,
    id: 4,
  },
  {
    translationKey: "cityOrTown",
    label: "Thị trấn/Thành phố",
    name: "cityOrTown",
    required: true,
    autoComplete: true,
    id: 5,
  },
  {
    translationKey: "phoneNumber",
    label: "Số điện thoại",
    name: "phoneNumber",
    required: true,
    type: "tel",
    autoComplete: true,
    id: 6,
    regex: regexPatterns.iraqiPhone,
  },
  {
    translationKey: "email",
    label: "Địa chỉ email",
    name: "email",
    required: true,
    type: "email",
    autoComplete: true,
    id: 7,
    regex: regexPatterns.email,
  },
];
