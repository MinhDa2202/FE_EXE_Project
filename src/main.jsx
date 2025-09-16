import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import * as serviceWorker from "../public/register-pwa.js";
import App from "./App.jsx";
import { store } from "./App/store.jsx";
import ErrorBoundary from "./Components/Shared/ErrorBoundary/ErrorBoundary";
import "./Styles/main.scss";
import "./i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);

serviceWorker.register();
