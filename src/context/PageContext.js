import { createContext, useState } from 'react';

export const PageContext = createContext({
  page: '',
  changePage: () => {}
});


export default function PageContextProvider({children}) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentOrder, setCurrentOrder] = useState({
    id: "#302011",
    status: "Processing",
    dateAdded: "12 Dec 2022",
    paymentMethod: "Visa",
    shippingMethod: "Flat Shipping",
    customer: "Josh Adam",
    customerEmail: "joshadam@gmail.com",
    customerPhone: "909 427 2910",
    customerAddress: "1833 Bel Meadow Drive, Fontana, California 92335, USA"
  })

  function handlePageChange(page) {
    setCurrentPage(page)
  }

  function handleViewOrder(order) {
    setCurrentOrder(order)
  }

  

  const pageCtx = {
    page: currentPage,
    changePage: handlePageChange,
    order: currentOrder,
    viewOrder: handleViewOrder,
  }

  return (
    <PageContext.Provider value={pageCtx}>
      {children}
    </PageContext.Provider>)
}