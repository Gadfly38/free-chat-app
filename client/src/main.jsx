import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { store, persistor } from "./store/index.js";
import App from "./App.jsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <BrowserRouter> */}
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* </BrowserRouter> */}
      </QueryClientProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
