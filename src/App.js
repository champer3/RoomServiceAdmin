import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import AddProjectsPage from "./pages/AddProducts";
import ProductsPage from "./pages/Products";
import SidePanel from "./pages/SidePanel";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import ViewMessage from "./pages/ViewMessage";
const router = createBrowserRouter([
  {
    path: '/',
    element: <SidePanel />,
    children: [
      { path: '/', element: <HomePage /> },
    { path: '/products', element: <ProductsPage /> },
    {path: '/add-products', element: <AddProjectsPage />}
  ]
  }

])
function App() {
  return (
    <>
    {/* <RouterProvider router={router} /> */}
    <ViewMessage/>
    </>
    
  );
}

export default App;
