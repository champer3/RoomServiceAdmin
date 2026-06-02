import AddProductsPage from "./AddProducts";

// Edit Product is an exact UI copy of Add Product.
// The shared page switches to edit mode automatically via the :productId route param.
export default function EditProductPage() {
  return <AddProductsPage />;
}