import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setItemToLocalStorage } from "../Helper/useLocalStorage";

const useStoreWebsiteDataToLocalStorage = () => {
  const userData = useSelector((state) => state.user);
  const productsData = useSelector((state) => state.products);
  const localStorageData = useSelector((state) => state.localStorage);

  useEffect(() => {
    // Create a copy of productsData without the 'products' array to avoid localStorage conflicts
    const productsDataForStorage = {
      ...productsData,
      products: [], // Don't store products array in localStorage to prevent conflicts
    };

    setItemToLocalStorage("productsSliceData", productsDataForStorage);
    setItemToLocalStorage("userSliceData", userData);
    setItemToLocalStorage("storageSliceData", localStorageData);
  }, [userData, productsData, localStorageData]);
};
export default useStoreWebsiteDataToLocalStorage;
