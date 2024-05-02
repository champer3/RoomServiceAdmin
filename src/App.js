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
      { path: '/settings', element: <Settings/>}
    ]
  }

])
function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
