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
  // Mock product data has been removed as requested
  // Products will now be loaded from API only
];

productsData.forEach((product) => {
  setAfterDiscountKey(product);
  setFormattedPrice(product);
});
