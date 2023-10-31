import { FormInstance } from "antd";

export interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'number' | 'text';
    record: T;
    index: number;
    form: FormInstance<T>
    children: React.ReactNode;
  }