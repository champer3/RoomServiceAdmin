import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import SidePanel from "./pages/SidePanel";
const router = createBrowserRouter([
  {
    path: '/',
    element: <SidePanel />,
    children: [{ path: '/', element: <HomePage /> },
    { path: '/products', element: <ProductsPage /> }]
  }

])
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
