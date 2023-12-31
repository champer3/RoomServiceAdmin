import React, { createContext, useState } from 'react';

export const PageContext = createContext();


export const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('/');

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};