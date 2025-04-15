import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { AuthProvider } from "./context/AuthContext.tsx";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <Toaster position='top-center'/>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

