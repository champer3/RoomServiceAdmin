import { createContext, useState } from "react";
import snackImg from "../assets/snacks.png";
import { CATEGORIES_LIST } from "../assets/data";

export const PageContext = createContext({
  page: "",
  changePage: () => {},
  isAuthUser: false,
  changeUserAuthStatus: () => {},
});

export default function PageContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(false);
  const [file, setFile] = useState(null);
  const [categoryImageCheck, setCategoryImageCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState("empty");
  const [categoriesList, setCategories] = useState(CATEGORIES_LIST);
  const [currentOrder, setCurrentOrder] = useState({
    id: "#302011",
    status: "Processing",
    dateAdded: "12 Dec 2022",
    paymentMethod: "Visa",
    shippingMethod: "Flat Shipping",
    customer: "Josh Adam",
    customerEmail: "joshadam@gmail.com",
    customerPhone: "909 427 2910",
    customerAddress: "1833 Bel Meadow Drive, Fontana, California 92335, USA",
  });
  const [currentCategory, setCurrentCategory] = useState({
    id: 1,
    image: snackImg,
    imageURL: "../assets/snacks.png",
    name: "Snacks",
    description:
      "This covers various snacks like chocolate chips, sweets, etc.",
  });

  function handleChangeCategoryImageCheck(value) {
    setCategoryImageCheck(value);
  }
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleViewOrder(order) {
    setCurrentOrder(order);
  }

  function handleViewCategory(category) {
    setCurrentCategory(category);
  }

  function handleUpdateCategory(id, newImage, newName, newDescription) {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id
          ? {
              ...category,
              image: newImage,
              name: newName,
              description: newDescription,
            }
          : category
      )
    );
  }

  function handleChangeFile(file) {
    setFile(file);
  }

  const pageCtx = {
    page: currentPage,
    changePage: handlePageChange,
    order: currentOrder,
    viewOrder: handleViewOrder,
    category: currentCategory,
    viewCategory: handleViewCategory,
    categories: categoriesList,
    updateCategory: handleUpdateCategory,
    file: file,
    changeFile: handleChangeFile,
    categoryImageCheck: categoryImageCheck,
    changeCategoryImageCheck: handleChangeCategoryImageCheck,
    isAuthUser: authUser,
    changeUserAuthStatus: setAuthUser,
  };

  return (
    <PageContext.Provider value={pageCtx}>{children}</PageContext.Provider>
  );
}
