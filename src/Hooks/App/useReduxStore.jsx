import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useReduxStore = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);
  
  // Check if products state exists and has required properties
  const productsState = useSelector((state) => state?.products);
  
  useEffect(() => {
    if (productsState && 
        Array.isArray(productsState.wishList) && 
        Array.isArray(productsState.orderProducts) && 
        Array.isArray(productsState.favoritesProducts) && 
        Array.isArray(productsState.searchProducts)) {
      setIsStoreReady(true);
    }
  }, [productsState]);
  
  return {
    isStoreReady,
    productsState,
    wishList: productsState?.wishList || [],
    orderProducts: productsState?.orderProducts || [],
    favoritesProducts: productsState?.favoritesProducts || [],
    searchProducts: productsState?.searchProducts || [],
  };
};
