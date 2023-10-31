import { Drawer } from 'antd';
import { ReactElement, createContext, useState } from 'react';

type Placement = 'left' | 'right' | 'top' | 'bottom';

type SetDrawerTitleFn = (title: string) => any;
type SetPlacementFn = (placement: Placement) => any;
type OpenDrawerFn = () => void;
type SetContentFn = (component: ReactElement) => any;
type SetSizeFn = (size: 'default' | 'large') => any;

type DrawerContextType = {
  setDrawerTitle?: SetDrawerTitleFn;
  setPlacement?: SetPlacementFn;
  openDrawer?: OpenDrawerFn;
  setContent?: SetContentFn;
  setSize?: SetSizeFn;
  onClose?: () => any
  drawerOpen?: boolean
};

export const DrawerContext = createContext<DrawerContextType>({});

const DrawerProvider = ({ children }: any) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Drawer');
  const [placement, setPlacement] = useState<Placement>('right');
  const [content, setContent] = useState<ReactElement>(<></>);
  const [size, setSize] = useState<'default' | 'large'>('default');

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
        setSize,
        onClose,
        drawerOpen
      }}>
      <Drawer
        title={title}
        placement={placement}
        onClose={onClose}
        closeIcon={null}
        size={size}
        open={drawerOpen}>
        {content}
      </Drawer>
      {children}
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
