import React, { createContext, useContext } from 'react';

export const MobileContext = createContext<boolean>(false);

export const useIsMobile = (): boolean => {
  return useContext(MobileContext);
};
