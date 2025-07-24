import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../features/dashboard";
import Analytics from "../features/analytics";
import CustomerData from "../features/customerData";
import Customers from "../features/customers";
import Header from "../components/header";
import { ThemeProvider } from "../components/theme-provider";
import ProtectedRoute from "../app/protectedRoutes";
import Login from "../features/login";

import { store, persistor } from "../store/store"; // Ensure store is initialized
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex h-full flex-col">
      {!isLoginPage && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path=":uid"
            element={
              <ProtectedRoute>
                <CustomerData />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers_list"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ div>

  );
};

// export default AppRoutes;


function AppRoutes() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  )
}

export default AppRoutes
