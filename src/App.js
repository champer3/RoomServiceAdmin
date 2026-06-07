import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import AddProjectsPage from "./pages/AddProducts";
import ProductsPage from "./pages/Products";
import SidePanel from "./pages/SidePanel";
import CategoriesPage from "./pages/Categories";
import AddCategoryPage from "./pages/AddCategory";
import EditCategoryPage from "./pages/EditCategory";
import OrdersPage from "./pages/Orders";
import OrderDetailsPage from "./pages/OrderDetails";
import CustomersPage from "./pages/Customers";
import CustomerDetailsPage from "./pages/CustomerDetails";
import Settings from "./pages/Settings";
import PromotionsPage from "./pages/Promotions";
import PromotionEditor from "./pages/PromotionEditor";
import EditProductPage from "./pages/EditProduct";
import Messages from "./pages/Messages";
import PageContextProvider from "./context/PageContext";
import ViewMessage from "./pages/ViewMessage";
import LoginPage from "./pages/Login";
import { initializeSocket } from "./socketService";
import { useEffect } from "react";
import OrderNotifications from "./pages/OrderNotifications";
import DriverOrdersPage from "./pages/DriverOrdersPage";
import DriversSidePanel from "./pages/DriversSidePanel";
import DriversDashboard from "./pages/DriversDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/drivers",
    element: <DriversSidePanel />,
    children: [
      { path: "/drivers/drivers-dashboard/", element: <DriversDashboard /> },
      { path: "/drivers/drivers-order/:orderId", element: <DriverOrdersPage /> },
    ],
  },
  {
    path: "/",
    element: <SidePanel />,
    children: [
      { path: "/dashboard", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/add-products", element: <AddProjectsPage /> },
      { path: "/categories", element: <CategoriesPage /> },
      { path: "/add-category", element: <AddCategoryPage /> },
      { path: "/edit-product/:productId", element: <EditProductPage /> },
      { path: "/edit-category", element: <EditCategoryPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/order-details/:orderId", element: <OrderDetailsPage /> },
      { path: "/order-notifications", element: <OrderNotifications /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/customer-details", element: <CustomerDetailsPage /> },
      { path: "/settings", element: <Settings /> },
      { path: "/coupons", element: <Navigate to="/promotions" replace /> },
      { path: "/add-coupons", element: <Navigate to="/promotions/new" replace /> },
      { path: "/promotions", element: <PromotionsPage /> },
      { path: "/promotions/new", element: <PromotionEditor /> },
      { path: "/promotions/:id/edit", element: <PromotionEditor /> },
      { path: "/messages", element: <Messages /> },
      { path: "/viewmessage", element: <ViewMessage /> },
    ],
  },
]);

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initializeSocket(token);
    }
  }, []);

  return (
    <PageContextProvider>
      <RouterProvider router={router} />
    </PageContextProvider>
  );
}

export default App;
