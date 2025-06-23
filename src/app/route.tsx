import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../features/dashboard";
import Analytics from "../features/analytics";
import Reports from "../features/reports";
import CustomerData from "../features/customerData";
import Customers from "../features/customers";
import Recommendations from "../features/recommendations";
import Header from "../components/header";
import { ThemeProvider } from "../components/theme-provider";
import ProtectedRoute from "../app/protectedRoutes";
import Login from "../features/login";

import { store } from "../store/store"; // Ensure store is initialized
import { Provider } from "react-redux";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>

  );
};

// export default AppRoutes;


function AppRoutes() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

export default AppRoutes
