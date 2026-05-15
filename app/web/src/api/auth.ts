import { createAxiosInstance } from "./base";

const axiosInstanceApi = createAxiosInstance("/api/web/v1/auth/");

// register user with name, email and password
export const register = async ({ last_name, first_name, email, password }: { last_name: string, first_name: string, email: string, password: string }) => {
    const response = await axiosInstanceApi.post("/register", { last_name, first_name, email, password });
    return response.data;
};

// login with user name and password
export const login = async ({ email, password }: { email: string, password: string }) => {
    const response = await axiosInstanceApi.post("/login", { email, password });
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

// get me
export const getMe = async () => {
    const response = await axiosInstanceApi.get("/auth/getMe");
    return response.data;
};