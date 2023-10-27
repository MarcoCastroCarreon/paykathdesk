import React from 'react';
import { ViewKeys, ViewStructure } from '../views/types/view.type';
import Views from '../views';

type ViewContextType = {
  viewSelected: any;
  setViewSelected: Function;
  onSelectView: Function;
  loading: boolean;
  setLoading: Function;
  toggleAlert: boolean;
  setToggleAlert: Function;
};

export const ViewsContext = React.createContext<ViewContextType>({} as any);

export const ViewsProvider = ({ children }: any) => {
  const [viewSelected, setViewSelected] = React.useState<ViewStructure>(
    Views['budgets']
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [toggleAlert, setToggleAlert] = React.useState<boolean>(false);

  const onSelectView = (key: ViewKeys): void => {
    setViewSelected(Views[key]);
  };

  return (
    <ViewsContext.Provider
      value={{
        viewSelected,
        setViewSelected,
        onSelectView,
        loading,
        setLoading,
        toggleAlert,
        setToggleAlert,
      }}>
      {children}
    </ViewsContext.Provider>
  );
};
