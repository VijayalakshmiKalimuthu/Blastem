import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
  <ToastContainer
      autoClose={2000}
      theme="dark"
      style={{
        fontSize: "1.2rem",
        fontFamily: "Poppins",
      }}
    />
    <Provider store={store}>
      {/* <PersistGate persistor={persistor} loading={null}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </>
    
  // </React.StrictMode>
);
