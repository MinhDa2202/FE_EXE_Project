import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage";
import useLoadLoginFromLocalStorage from "./Hooks/App/useLoadLoginFromLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./Routes/AppRoutes";
import ChatWidget from "./Components/ChatWidget/ChatWidget";
import AddProductModal from "./Components/Shared/PopUps/AddProductModal/AddProductModal";
import { closeAddProductModal } from "./Features/uiSlice";
import { triggerRefetch } from "./Features/productsSlice";


function App() {
  useStoreWebsiteDataToLocalStorage();
  useLoadLoginFromLocalStorage();
  const { isAddProductModalOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeAddProductModal());
  };

  const handleProductAdded = () => {
    dispatch(closeAddProductModal());
    dispatch(triggerRefetch());
  };


  return (
    <>
      <AppRoutes />
      <ChatWidget />
      {isAddProductModalOpen && (
        <AddProductModal
          onClose={handleCloseModal}
          onProductAdded={handleProductAdded}
        />
      )}
    </>
  );
}

export default App;
