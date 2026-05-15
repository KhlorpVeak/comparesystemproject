import { Route, Routes } from "react-router-dom";
import OverviewPage from "../pages/OverviewPage";
import ProductsPage from "../pages/ProductsPage";
import UserPage from "../pages/UserPage";
import ListComparePage from "../pages/ListComparePage";
import AddComparePage from "../pages/AddComparePage";
import Login from "../pages/auth/login";
import RegisterUser from "../pages/auth/register-user";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/users" element={<UserPage />} />
      <Route path="/list-compare" element={<ListComparePage />} />
      <Route path="/add-compare" element={<AddComparePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />
    </Routes>
  )
}

export default Router;