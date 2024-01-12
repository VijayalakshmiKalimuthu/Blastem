import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login_Page/loginPage";
import RegisterPage from "./pages/Register_Page/registerPage";

import Dashbord_Page from "./pages/Dashboard_Page/Dashbord_Page";
import { Provider } from "react-redux";
import User_Dashboard_Page from "./pages/User_Dashboard/User_Dashboard_Page";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./store/store";
function App() {
  const persistor = persistStore(store);

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Router>
            <Routes>
              {/* I need to block the user from accessing the dashboard page if he is not logged in */}
              <Route path="/" Component={LoginPage} />
              <Route path="/register" Component={RegisterPage} />
              <Route path="/login" Component={LoginPage} />
              <Route path="/dashboard" Component={Dashbord_Page} />
              <Route path="/user" Component={User_Dashboard_Page} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
