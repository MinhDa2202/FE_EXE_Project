import {
  ps5Gamepad,
  ps5GamepadThum1,
  ps5GamepadThum2,
  ps5GamepadThum3,
  wiredKeyboard,
  wiredKeyboardThum1,
  wiredKeyboardThum2,
  wiredKeyboardThum3,
  gamingMonitor,
  gamingMonitorThum1,
  gamingMonitorThum2,
  gamingMonitorThum3,
  cpuCooler,
  cpuCoolerThum1,
  cpuCoolerThum2,
  cpuCoolerThum3,
  canonCamera,
  canonCameraThum1,
  canonCameraThum2,
  canonCameraThum3,
  gamingLaptop,
  gamingLaptopThum1,
  gamingLaptopThum2,
  gamingLaptopThum3,
  kidsCar,
  kidsCarThum1,
  kidsCarThum2,
  kidsCarThum3,
  usbGamepad,
  usbGamepadThum1,
  usbGamepadThum2,
  usbGamepadThum3,
} from "src/Assets/Products/ProductImgs";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/helper";

export const productsData = [
  {
    shortName: "PS5 Gamepad",
    name: "PS5 Gamepad",
    category: "gaming",
    price: 69.99,
    discount: 40,
    description: `
    PlayStation 5 Controller Skin High quality vinyl with air channel adhesive
    for easy bubble free install & mess free removal Pressure sensitive.`,
    addedDate: "2024/2/2",
    img: ps5Gamepad,
    otherImages: [
      ps5Gamepad,
      ps5GamepadThum1,
      ps5GamepadThum2,
      ps5GamepadThum3,
    ],
    colors: [
      { name: "ice blue", color: "#dcdfea" },
      { name: "black", color: "#27292d" },
    ],
    rate: 5,
    votes: 88,
    quantity: 1,
    sold: 105,
    id: 1,
  },
  {
    shortName: "AK-9000 Keyboard",
    name: "AK-900 Wired Keyboard",
    category: "gaming",
    price: 8.66,
    discount: 35,
    description: `
    Elevate your gaming experience with the AK-900 Wired Keyboard. Designed for
    precision and durability, this keyboard boasts high responsiveness and tactile
    feedback. Its sleek design and customizable RGB lighting make it a stylish
    addition to any gaming setup.`,
    addedDate: "2024/2/7",
    img: wiredKeyboard,
    otherImages: [
      wiredKeyboard,
      wiredKeyboardThum1,
      wiredKeyboardThum2,
      wiredKeyboardThum3,
    ],
    colors: [{ name: "black", color: "#03040f" }],
    rate: 4,
    votes: 75,
    quantity: 1,
    sold: 210,
    id: 2,
  },
  {
    shortName: "LCD Monitor",
    name: "IPS LCD Gaming Monitor",
    category: "gaming",
    price: 244.8,
    discount: 30,
    description: `
    Immerse yourself in the world of gaming with the IPS LCD Gaming Monitor. Featuring
    stunning visuals and ultra-smooth gameplay, this monitor delivers an unparalleled
    gaming experience.`,
    addedDate: "2024/3/15",
    img: gamingMonitor,
    otherImages: [
      gamingMonitor,
      gamingMonitorThum1,
      gamingMonitorThum2,
      gamingMonitorThum3,
    ],
    colors: [{ name: "black", color: "#151515" }],
    rate: 5,
    quantity: 1,
    votes: 99,
    sold: 463,
    id: 3,
  },
  {
    shortName: "CPU Cooler",
    name: "RGB liquid CPU Cooler",
    category: "gaming",
    price: 139,
    discount: 30,
    description: `
    Keep your CPU running cool and quiet with the RGB Liquid CPU Cooler. Featuring advanced cooling
    technology and customizable RGB lighting.`,
    addedDate: "2024/3/7",
    img: cpuCooler,
    otherImages: [
      cpuCooler,
      cpuCoolerThum1,
      cpuCoolerThum2,
      cpuCoolerThum3,
    ],
    colors: [
      { name: "gray", color: "#8e8e8e" },
      { name: "black", color: "#0e0e0e" },
    ],
    rate: 4.5,
    votes: 190,
    quantity: 1,
    sold: 2522,
    id: 7,
  },
  {
    shortName: "Cannon Camera",
    name: "CANON EOS DSLR Camera",
    category: "camera",
    price: 6499,
    discount: 0,
    description: `
    Capture life's precious moments with the CANON EOS DSLR Camera. Whether you're a professional photographer or an
    amateur enthusiast, this camera delivers stunning image quality and performance.`,
    addedDate: "2024/3/7",
    img: canonCamera,
    otherImages: [
      canonCamera,
      canonCameraThum1,
      canonCameraThum2,
      canonCameraThum3,
    ],
    colors: [{ name: "black", color: "#000201" }],
    rate: 4,
    votes: 94,
    quantity: 1,
    sold: 83,
    id: 10,
  },
  {
    shortName: "FHD Laptop",
    name: "ASUS FHD Gaming Laptop",
    category: "computers",
    price: 767.99,
    discount: 5,
    description: `
    Experience unparalleled gaming performance with the ASUS FHD Gaming Laptop. Powered by cutting-edge hardware and
    featuring a stunning Full HD display.`,
    addedDate: "2024/3/7",
    img: gamingLaptop,
    otherImages: [
      gamingLaptop,
      gamingLaptopThum1,
      gamingLaptopThum2,
      gamingLaptopThum3,
    ],
    colors: [{ name: "black", color: "#0c0c0c" }],
    rate: 4.5,
    votes: 1049,
    quantity: 1,
    sold: 1792,
    id: 11,
  },
  {
    shortName: "Electric Car",
    name: "Kids Electric Car",
    category: "gaming",
    price: 399.99,
    discount: 0,
    description: `
    Spark your child's imagination with the Kids Electric Car. Designed for fun and excitement, this car features
    realistic details and effortless controls that make every ride an adventure.`,
    addedDate: "2024/3/7",
    img: kidsCar,
    otherImages: [
      kidsCar,
      kidsCarThum1,
      kidsCarThum2,
      kidsCarThum3,
    ],
    colors: [
      { name: "red", color: "#ff6066" },
      { name: "black", color: "#000201" },
      { name: "white", color: "#dcdcdc" },
    ],
    rate: 3,
    votes: 22,
    quantity: 1,
    sold: 100,
    id: 13,
  },
  {
    shortName: "GP11 Gamepad",
    name: "GP11 Shooter USB Gamepad",
    category: "gaming",
    price: 13.86,
    discount: 0,
    description: `
    Dominate the competition with the GP11 Shooter USB Gamepad. Designed for precision and comfort, this gamepad
    delivers an immersive gaming experience.`,
    addedDate: "2024/3/7",
    img: usbGamepad,
    otherImages: [
      usbGamepad,
      usbGamepadThum1,
      usbGamepadThum2,
      usbGamepadThum3,
    ],
    colors: [{ name: "black", color: "#242424" }],
    rate: 5,
    votes: 64,
    quantity: 1,
    sold: 100,
    id: 15,
  },
];

productsData.forEach((product) => {
  setAfterDiscountKey(product);
  setFormattedPrice(product);
});
