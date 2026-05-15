import { useLocation } from "react-router-dom";
import Login from "./login";
import RegisterUser from "./register-user";

export default function AuthPage() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login'

    return (
        <>
            <div className="flex h-screen w-full text-gray-100 overflow-hidden">
                {isAuthPage ? <Login /> : <RegisterUser />}
            </div>
        </>
    );
}
