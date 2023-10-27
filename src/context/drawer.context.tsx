import { Drawer } from 'antd';
import { ReactElement, createContext, useState } from 'react';

type DrawerContextType = {
  setDrawerTitle?: Function;
  setPlacement?: Function;
  openDrawer?: Function;
  setContent?: Function;
};

type Placement = 'left' | 'right' | 'top' | 'bottom';

export const DrawerContext = createContext<DrawerContextType>({});

const DrawerProvider = ({ children }: any) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Drawer');
  const [placement, setPlacement] = useState<Placement>('right');
  const [content, setContent] = useState<ReactElement>(<></>);

  const onClose = () => {
    setDrawerOpen(false);
  };

  const onOpen = () => {
    setDrawerOpen(true);
  };

  return (
    <DrawerContext.Provider
      value={{
        setDrawerTitle: setTitle,
        setPlacement,
        openDrawer: onOpen,
        setContent,
      }}>
      <Drawer
        title={title}
        placement={placement}
        onClose={onClose}
        open={drawerOpen}>
        {content}
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
