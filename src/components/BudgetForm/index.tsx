import locale from 'antd/es/date-picker/locale/es_ES';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Button,
  Form,
  Switch,
  Table,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Popconfirm,
  Flex,
} from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  CalculatorOutlined,
  EditOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { BudgetFormObj, Budget } from '../../shared/types/budget.type';
import { DrawerContext } from '../../context/drawer.context';
import { Payment } from '../../shared/types/payment.type';
import { Column } from '../../shared/types/column.type';
import moneyFormatter from '../../shared/utils/moneyFormatter';
import moneyParser from '../../shared/utils/moneyParser';
import EditableCell from '../EditableCell';
import { API } from '../../api';
import { ToastContext } from '../../context/toast.context';
import { ModalContext } from '../../context/modal.context';
import dayjs from 'dayjs';
import { TableRowSelection } from 'antd/es/table/interface';
dayjs.extend(customParseFormat);

const { Item: FormItem, useForm } = Form;

const BudgetForm = (budget: BudgetFormObj & { mode: 'create' | 'update' }) => {
  const controller = new AbortController();

  // States
  const [form] = useForm();
  const [paymentForm] = useForm<Payment>();
  const { drawerOpen } = useContext(DrawerContext);
  const { sendToast } = useContext(ToastContext);
  const { setFieldsValue, setFieldValue } = form;
  const [displayBudget, setDisplayBudget] = useState<BudgetFormObj>(budget);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState('');
  const { modalOpen, confirmLoading, setConfirmLoading, onClose = () => {}} =
    useContext(ModalContext);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // Actions Functions
  const onChangeField = (fieldsData: BudgetFormObj): void => {
    console.log('Change!!!!');
    setDisplayBudget({
      ...displayBudget,
      ...fieldsData,
    });
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setInternalLoading(true);
      if (budget.mode == 'create') setConfirmLoading(true);
      await form.validateFields();
      const request = await API.callApi<Budget>({
        path:
          budget.mode == 'create'
            ? `/budgets`
            : `/budgets?budgetId=${budget._id}`,
        signal: controller.signal,
        body: {
          ...displayBudget,
          date: displayBudget.date.format('DD-MM-YYYY'),
          year: new Date().getFullYear(),
          _id: undefined
        },
        requestType: budget.mode == 'create' ? 'post' : 'put',
      });

      if (request.error) {
        setInternalLoading(false);
        if (budget.mode == 'create') setConfirmLoading(false);
        sendToast(
          'Error al intentar guardar presupuesto',
          'No se ha podido guardar la información en este momento intentelo más tarde',
          'error'
        );
        return;
      }

      setInternalLoading(false);
      if (budget.mode == 'create') {
        setConfirmLoading(false);
        onClose();
      }
      sendToast(
        'Presupuesto Guardado',
        'Se guardo la información correctamente',
        'success'
      );
    } catch (error) {
      controller.abort();
      if (error instanceof Error) {
        sendToast(
          'Error de Sistema',
          'No se ha encontrado la causa del error, contacte a su administrador.',
          'error'
        );
      }
      setInternalLoading(false);
      if (budget.mode == 'create') setConfirmLoading(false);
    }
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

  const handleCalculate = async () => {
    try {
      setInternalLoading(true);
      const request = await API.callApi({
        path: '/budgets/calculate',
        signal: controller.signal,
        body: displayBudget,
        requestType: 'post',
      });

      if (request.error) {
        setInternalLoading(false);
        sendToast(
          'Error al intentar calcular',
          'No se ha podido calcular en este momento el presupuesto',
          'error'
        );
        return;
      }

      const calculatedData = request.result.data;

      setDisplayBudget({
        ...displayBudget,
        ...calculatedData,
        date: dayjs(displayBudget.date, 'DD-MM-YYYY'),
      });
      setFieldsValue({
        ...displayBudget,
        ...calculatedData,
        date: dayjs(displayBudget.date, 'DD-MM-YYYY'),
      });
      setInternalLoading(false);
    } catch (error) {
      controller.abort();
      setInternalLoading(false);
    }
  };

  const isEditing = (record: Payment) => record.name === editingKey;

  const editPayment = (record: Partial<Payment>) => {
    paymentForm.setFieldsValue({
      name: '',
      payment: 0,
      paid: false,
      _id: '',
      budgetId: '',
      type: 'PAYMENT',
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
      const index = newData.findIndex(item => record.key === item.key);
      console.log(index, newData, row, record);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          type: 'PAYMENT',
        });
        setDisplayBudget({ ...displayBudget, paymentsList: newData });
        setEditingKey('');
      } else {
        newData.push(row);
        setDisplayBudget({ ...displayBudget, paymentsList: newData });
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const addPayment = () => {
    const key = displayBudget.paymentsList.length;
    paymentForm.setFieldsValue({
      budgetId: budget._id || '',
      paid: false,
      name: 'Pago' + displayBudget.paymentsList.length,
      payment: 0,
      key,
      type: 'PAYMENT',
    });
    setDisplayBudget({
      ...displayBudget,
      paymentsList: [
        ...displayBudget.paymentsList,
        {
          budgetId: budget._id || '',
          paid: false,
          name: 'Pago' + displayBudget.paymentsList.length,
          payment: 0,
          key,
          type: 'PAYMENT',
        },
      ],
    });

    setEditingKey('Pago' + displayBudget.paymentsList.length);
  };

  const deletePayments = () => {
    setDisplayBudget({
      ...displayBudget,
      paymentsList: displayBudget.paymentsList.filter(
        payment => !selectedRows.includes(payment.key)
      ),
    });
    setSelectedRows([]);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRows(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Payment> = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
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
        title: 'Actualizar',
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
        year: String(new Date().getFullYear()),
        date: dayjs(),
        exceeded: '',
      });
      setInternalLoading(false);
      controller.abort();
    } else {
      setFieldsValue({
        ...budget,
        exceeded: budget.exceeded ?? '0',
        date: dayjs(budget.date, 'DD-MM-YYYY'),
        paymentsList: budget.paymentsList.map((payment, index) => ({
          ...payment,
          key: index,
        })),
      });
      setDisplayBudget({
        ...budget,
        date: dayjs(budget.date, 'DD-MM-YYYY'),
        paymentsList: budget.paymentsList.map((payment, index) => ({
          ...payment,
          key: index,
        })),
      });
      setInternalLoading(false);
    }
  }, [drawerOpen, modalOpen]);

  useEffect(() => {
    if (modalOpen && confirmLoading == true) {
      onSubmit();
    }
  }, [confirmLoading]);

  //Component
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      onValuesChange={onChangeField}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 10 }}>
      <Row gutter={1}>
        <Col span={4}>
          <Button
            onClick={handleCalculate}
            disabled={internalLoading}
            icon={<CalculatorOutlined />}>
            Calcular
          </Button>
        </Col>
        <Col span={10}>
          <FormItem<BudgetFormObj>
            name="date"
            label="Fecha"
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
            <DatePicker
              size="small"
              value={displayBudget.date}
              placeholder="Fecha"
              format="DD-MM-YYYY"
              locale={locale}
              disabled={internalLoading}
            />
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem<BudgetFormObj>
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

      <FormItem<BudgetFormObj>
        name="paymentsList"
        style={{ display: 'flex', justifyContent: 'center' }}>
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
          title={() => (
            <div style={{ display: 'flex', minWidth: 500 }}>
              <Button onClick={() => addPayment()} type="primary">
                Agregar
              </Button>
              <Popconfirm
                title="Estás seguro de eliminar?"
                onConfirm={() => deletePayments()}
                okText="Sí"
                cancelText="Cancelar">
                <Button>Eliminar</Button>
              </Popconfirm>
            </div>
          )}
          rowSelection={rowSelection}
        />
      </FormItem>

      <Row>
        <Col span={6}>
          <FormItem<BudgetFormObj> name="totalPayment" label="Total">
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
        <Col span={6}>
          <FormItem<BudgetFormObj>
            name="remaining"
            label="Restante"
            style={{ paddingLeft: 10 }}>
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
        <Col span={8}>
          <FormItem<BudgetFormObj> name="exceeded" label="Excedido">
            <InputNumber
              formatter={moneyFormatter}
              parser={moneyParser}
              value={displayBudget.exceeded}
              min="0"
              disabled
              style={{ color: 'black' }}
            />
          </FormItem>
        </Col>
      </Row>

      {budget.mode == 'update' && (
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
      )}
    </Form>
  );
};

export default BudgetForm;
