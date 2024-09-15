import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import CouponsPage from "./pages/Coupons";
import EditProductPage from "./pages/EditProduct";
import Messages from "./pages/Messages";
import AddCouponsPage from "./pages/AddCoupons";
import PageContextProvider from "./context/PageContext";
import ViewMessage from "./pages/ViewMessage";
import LoginPage from "./pages/Login";
import { getSocket, initializeSocket } from "./socketService";
import { useEffect, useState } from "react";
import OrderNotifications from "./pages/OrderNotifications";
import DriverOrdersPage from "./pages/DriverOrdersPage";
import DriversHomePage from "./pages/DriversHome";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <SidePanel />,
    children: [
      // { path: "/home", element: <HomePage /> },
      { path: "/dashboard", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/add-products", element: <AddProjectsPage /> },
      { path: "/categories", element: <CategoriesPage /> },
      { path: "/add-category", element: <AddCategoryPage /> },
      { path: "/edit-product/:productId", element: <EditProductPage /> },
      { path: "/edit-category", element: <EditCategoryPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/order-details", element: <OrderDetailsPage /> },
      { path: "/order-notifications", element: <OrderNotifications /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/customer-details", element: <CustomerDetailsPage /> },
      { path: "/settings", element: <Settings /> },
      { path: "/coupons", element: <CouponsPage /> },
      { path: "/add-coupons", element: <AddCouponsPage /> },
      { path: "/messages", element: <Messages /> },
      { path: "/viewmessage", element: <ViewMessage /> },
      { path: "/drivers-order", element: <DriverOrdersPage /> },
      { path: "/drivers", element: <DriversHomePage /> },
    ],
  },
]);
function App() {
  const token = localStorage.getItem("token");
  if (token) {
    initializeSocket(token);
  }
  // const [socket] = useState(() => getSocket())
  const [socket, setSocket] = useState(null);
  console.log("App component always mounted");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initializeSocket(token).then(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);
      });
    }
    // }
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("order", (data) => {
        console.log("Received message:", data);
        // Handle global state update or perform actions
      });

      return () => {
        socket.off("order"); // Correct the event name
      };
    }
  }, [socket]);
  return (
    <PageContextProvider>
      <RouterProvider router={router} />
    </PageContextProvider>
  );
}

export default App;
