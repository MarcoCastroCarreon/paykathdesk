import {
  Button,
  Form,
  Switch,
  Table,
  InputNumber,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  CalculatorOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Budget } from '../../shared/types/budget.type';
import { DrawerContext } from '../../context/drawer.context';
import { Payment } from '../../shared/types/payment.type';
import { Column } from '../../shared/types/column.type';

const { Item: FormItem, useForm } = Form;

const BudgetForm = (budget: Budget) => {
  // States
  const [form] = useForm();
  const { drawerOpen } = useContext(DrawerContext);
  const { setFieldsValue, setFieldValue } = form;
  const [displayBudget, setDisplayBudget] = useState<Budget>(budget);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  // Actions Functions
  const onChangeField = (fieldsData: Budget): void => {
    console.log('Field');
    setDisplayBudget({ ...displayBudget, ...fieldsData });
  };

  const onSubmit = (values: Budget): void => {
    console.log('Values', values);
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

  const handleDelete = (id: string) => {
    console.log('Handle Delete', id);
    const paymentListFiltered = displayBudget.paymentsList?.filter(
      payment => payment._id != id
    );

    console.log(displayBudget.paymentsList, paymentListFiltered);

    setFieldValue('paymentsList', paymentListFiltered);
    setDisplayBudget({ ...displayBudget, paymentsList: paymentListFiltered });
  };

  const handleCalculate = () => {
    setInternalLoading(true);
    setTimeout(() => setInternalLoading(false), 3000);
  };

  //Memos
  const paymentsListColumns: Column[] = useMemo(
    () => [
      { dataIndex: 'name', key: 'name', title: 'Nombre', ellipsis: true },
      { dataIndex: 'payment', key: 'payment', title: 'Cantidad' },
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
        title: 'Eliminar',
        key: 'delete',
        render(_: unknown, record: Payment) {
          return (
            <Popconfirm
              title="Estás seguro de eliminar?"
              onConfirm={() => handleDelete(record._id ?? '')}
              okText="Sí"
              cancelText="Cancelar">
              <DeleteOutlined
                style={{ fontSize: '32px', textAlign: 'center' }}
              />
            </Popconfirm>
          );
        },
      },
    ],
    [displayBudget.paymentsList]
  );

  // Effects
  useEffect(() => {
    console.log('Drawer', drawerOpen);
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
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              value={displayBudget.budget}
              min="0"
              disabled={internalLoading}
            />
          </FormItem>
        </Col>
      </Row>

      <FormItem<Budget> name="paymentsList">
        <Table
          columns={paymentsListColumns}
          dataSource={displayBudget.paymentsList}
          pagination={false}
          bordered
          loading={internalLoading}
        />
      </FormItem>

      <Row gutter={6}>
        <Col span={8}>
          <FormItem<Budget> name="totalPayment" label="Total">
            <InputNumber
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
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
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
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
          icon={<SendOutlined />}
          htmlType="submit"
          type="primary"
          loading={internalLoading}
          disabled={internalLoading}>
          Enviar
        </Button>
      </FormItem>
    </Form>
  );
};

export default BudgetForm;
