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
import AddCouponsPage from "./pages/AddCoupons";
import PageContextProvider from "./context/PageContext";
import Messages from "./pages/Messages";
import ViewMessage from "./pages/ViewMessage";
const router = createBrowserRouter([
  {
    path: '/',
    element: <SidePanel />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/add-products', element: <AddProjectsPage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/add-category', element: <AddCategoryPage /> },
      { path: '/edit-category', element: <EditCategoryPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/order-details', element: <OrderDetailsPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/customer-details', element: <CustomerDetailsPage /> },
      { path: '/coupons', element: <CouponsPage /> },
      { path: '/add-coupons', element: <AddCouponsPage /> },
      {path: '/messages', element: <Messages />},
      {path: '/view-messages', element: <ViewMessage/>},
      { path: '/settings', element: <Settings/>}
    ]
  }

])
function App() {
  return (
    <PageContextProvider>
      <RouterProvider router={router} />
    </PageContextProvider>



  );
}

export default App;
