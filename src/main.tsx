import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './app/route'
import "./Main.css"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {<AppRoutes />}
  </StrictMode>
);
