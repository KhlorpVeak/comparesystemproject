import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import Router from "./Routes/index";
import Sidebar from "./components/Sidebars/Sidebar";
import AuthPage from "./pages/auth";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = user && JSON.parse(user).token;
    const isAuthPage = location.pathname.startsWith('/register-user') || location.pathname === '/login';

    if (!token && !isAuthPage) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const isAuthPage = location.pathname.startsWith('/register-user') || location.pathname === '/login';

  return (
    <>
      <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden">
        {isAuthPage ? (
          <AuthPage />
        ) : (
          <>
            <Sidebar />
            <Router />
          </>
        )}
      </div>
    </>
  );
}
