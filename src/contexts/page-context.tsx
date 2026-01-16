import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface PageState {
  pageTitle: string;
  loading: boolean;
}

interface PageContextType extends PageState {
  setContextPage: (state: Partial<PageState>) => void;
}

const PageContext = createContext<PageContextType>({
  pageTitle: 'Home',
  loading: false,
  setContextPage: () => { },
});

export const usePageContext = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  
  return context;
};

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [state, setState] = useState<PageState>({
    pageTitle: 'Home',
    loading: false,
  });

  const setContextPage = useCallback((newState: Partial<PageState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  return (
    <PageContext.Provider value={{ ...state, setContextPage }}>
      {children}
    </PageContext.Provider>
  );
};

export default PageContext;
