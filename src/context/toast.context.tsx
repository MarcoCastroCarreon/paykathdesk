import { notification } from "antd";
import React from "react"

type ToastArgs = [message: string, description: string, toastType: ToastType];

type ToastFn = (...args: ToastArgs) => void;

type ToastContextType = { sendToast: ToastFn };

export const ToastContext = React.createContext<ToastContextType>({ sendToast: () => {} });
type ToastType = 'error' | 'info' | 'success';

const ToastProvider = ({ children }: any) => {
    const [api, contextHolder] = notification.useNotification();

    const sendToast = (message: string = 'Mensaje Default', description: string = 'Descripcion por Defecto',toastType: ToastType): void => {
        api[toastType]({ message, description, placement: 'topRight' });
    }

    return <ToastContext.Provider value={{ sendToast }} >
        {contextHolder}
        {children}
    </ToastContext.Provider>
}

export default ToastProvider;