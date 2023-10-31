import {
  Button,
  Form,
  Switch,
  Table,
  InputNumber,
  Row,
  Col,
  Popconfirm,
  Flex,
} from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  CalculatorOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Budget } from '../../shared/types/budget.type';
import { DrawerContext } from '../../context/drawer.context';
import { Payment } from '../../shared/types/payment.type';
import { Column } from '../../shared/types/column.type';
import moneyFormatter from '../../shared/utils/moneyFormatter';
import moneyParser from '../../shared/utils/moneyParser';
import EditableCell from '../EditableCell';

const { Item: FormItem, useForm } = Form;

const BudgetForm = (budget: Budget) => {
  // States
  const [form] = useForm();
  const [paymentForm] = useForm<Payment>();
  const { drawerOpen } = useContext(DrawerContext);
  const { setFieldsValue, setFieldValue } = form;
  const [displayBudget, setDisplayBudget] = useState<Budget>(budget);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState('');

  // Actions Functions
  const onChangeField = (fieldsData: Budget): void => {
    setDisplayBudget({ ...displayBudget, ...fieldsData });
  };

  const onSubmit = (_: Budget): void => {
    setInternalLoading(true);
    setTimeout(() => setInternalLoading(false), 3000);
  };

  const resetForm = () => {
    form.resetFields();
  };

  const onPaid = (record: Payment): void => {
    const payment = displayBudget.paymentsList?.find(p => p._id == record._id);

    if (payment) {
      payment.paid = record.paid;
      setDisplayBudget({ ...displayBudget });
      setFieldValue('paymentsList', displayBudget.paymentsList);
    }
  };

  const handleDelete = (name: string): void => {
    const paymentListFiltered = displayBudget.paymentsList?.filter(
      payment => payment.name != name
    );

    setDisplayBudget({ ...displayBudget, paymentsList: paymentListFiltered });
  };

  const handleCalculate = () => {
    setInternalLoading(true);
    setTimeout(() => setInternalLoading(false), 3000);
  };

  const isEditing = (record: Payment) => record.name === editingKey;

  const editPayment = (record: Partial<Payment>) => {
    paymentForm.setFieldsValue({
      name: '',
      payment: '',
      paid: false,
      _id: '',
      budgetId: '',
      ...record,
    });
    setEditingKey(record.name ?? '');
  };

  const cancelEdit = () => {
    setEditingKey('');
  };

  const save = async (record: Payment) => {
    try {
      const row: Payment = await paymentForm.validateFields();

      const newData = [...(displayBudget.paymentsList ?? [])];
      const index = newData.findIndex(item => record.name === item.name);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDisplayBudget({ ...displayBudget, paymentsList: newData});
        setEditingKey('');
      } else {
        newData.push(row);
        setDisplayBudget({ ...displayBudget, paymentsList: newData});
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  //Memos
  const paymentsListColumns: Column[] = useMemo(
    () => [
      { dataIndex: 'name', key: 'name', title: 'Nombre', editable: true },
      {
        dataIndex: 'payment',
        key: 'payment',
        title: 'Cantidad',
        editable: true,
      },
      {
        dataIndex: 'paid',
        key: 'paid',
        title: 'Pagado',
        render(value: boolean, record: Payment) {
          return (
            <Switch
              checked={value}
              onChange={newValue => onPaid({ ...record, paid: newValue })}
            />
          );
        },
      },
      {
        dataIndex: 'delete',
        title: 'Actualizar/Eliminar',
        key: 'delete',
        render(_: unknown, record: Payment) {
          const editable = isEditing(record);
          if (editable) {
            return (
              <Flex justify="space-evenly" style={{ fontSize: 32 }}>
                <SaveOutlined onClick={() => save(record)} />
                <StopOutlined onClick={() => cancelEdit()} />
              </Flex>
            );
          } else {
            return (
              <Flex justify="space-evenly">
                <EditOutlined
                  onClick={() => editPayment(record)}
                  style={{ fontSize: 32 }}
                />
                <Popconfirm
                  title="Estás seguro de eliminar?"
                  onConfirm={() => handleDelete(record.name ?? '')}
                  okText="Sí"
                  cancelText="Cancelar">
                  <DeleteOutlined style={{ fontSize: 32 }} />
                </Popconfirm>
              </Flex>
            );
          }
        },
      },
    ],
    [displayBudget.paymentsList, editingKey]
  );

  const mergedColumns = paymentsListColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Payment) => ({
        record,
        inputType: col.dataIndex === 'payment' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // Effects
  useEffect(() => {
    if (!drawerOpen) {
      resetForm();
      setDisplayBudget({
        budget: '',
        _id: '',
        paymentsList: [],
        remaining: '',
        totalPayment: '',
        year: '',
        date: '',
      });
    } else {
      setFieldsValue(budget);
      setDisplayBudget(budget);
    }
  }, [drawerOpen]);

  //Component
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      onValuesChange={onChangeField}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}>
      <Row gutter={2}>
        <Col span={7}>
          <Button
            onClick={handleCalculate}
            disabled={internalLoading}
            icon={<CalculatorOutlined />}>
            Calcular
          </Button>
        </Col>
        <Col span={16}>
          <FormItem<Budget>
            name="budget"
            label="Presupuesto"
            rules={[
              {
                validator(_, value) {
                  return new Promise((resolve, reject) => {
                    if (!value) reject('Campo requerido');
                    resolve('');
                  });
                },
              },
            ]}>
            <InputNumber
              formatter={moneyFormatter}
              parser={moneyParser}
              value={displayBudget.budget}
              min="0"
              disabled={internalLoading}
            />
          </FormItem>
        </Col>
      </Row>

      <FormItem<Budget> name="paymentsList">
        <Table
          columns={mergedColumns}
          dataSource={displayBudget.paymentsList}
          pagination={false}
          bordered
          loading={internalLoading}
          components={{
            body: {
              cell: (props: any) => (
                <EditableCell {...props} form={paymentForm} />
              ),
            },
          }}
        />
      </FormItem>

      <Row gutter={6}>
        <Col span={8}>
          <FormItem<Budget> name="totalPayment" label="Total">
            <InputNumber
              formatter={moneyFormatter}
              parser={moneyParser}
              value={displayBudget.totalPayment}
              min="0"
              disabled
              style={{ color: 'black' }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<Budget> name="remaining" label="Restante">
            <InputNumber
              formatter={moneyFormatter}
              parser={moneyParser}
              value={displayBudget.remaining}
              min="0"
              disabled
              style={{ color: 'black' }}
            />
          </FormItem>
        </Col>
      </Row>

      <FormItem>
        <Button
          icon={<SaveOutlined />}
          htmlType="submit"
          type="primary"
          loading={internalLoading}
          disabled={internalLoading}>
          Guardar
        </Button>
      </FormItem>
    </Form>
  );
};

export default BudgetForm;
