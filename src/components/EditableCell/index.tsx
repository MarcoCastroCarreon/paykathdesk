import { Form, Input, InputNumber } from 'antd';
import { EditableCellProps } from './types/editable-cell.type';

const EditableCell: React.FC<EditableCellProps<any>> = (
  data: EditableCellProps<any>
) => {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    form, 
    ...restProps
  } = data;
  const inputNode =
    inputType === 'number' ? (
      <InputNumber bordered={false} min='0' />
    ) : (
      <Input bordered={false} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form form={form} >
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Por favor ingresa ${title}!`,
              },
            ]}>
            {inputNode}
          </Form.Item>
        </Form>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
