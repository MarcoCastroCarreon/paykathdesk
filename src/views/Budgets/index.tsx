import {
  Button,
  DatePicker,
  Flex,
  FloatButton,
  Layout,
  Table,
  Typography,
} from 'antd';
import React, { useContext, useMemo } from 'react';
import { ViewsContext } from '../../context/views.context';
import { API } from '../../api';
import { BudgetFormObj } from '../../shared/types/budget.type';
import useLocalStorage from '../../shared/hooks/localStorage.hook';
import { ToastContext } from '../../context/toast.context';
import { Column } from '../../shared/types/column.type';
import Loader from '../../components/Loader';
import { DrawerContext } from '../../context/drawer.context';
import BudgetWrapper from '../../components/BudgetWrapper';
import { PlusOutlined } from '@ant-design/icons';
import { ModalContext } from '../../context/modal.context';
import BudgetForm from '../../components/BudgetForm';
import dayjs from 'dayjs';

const { Content } = Layout;

const { Title } = Typography;

const { YearPicker } = DatePicker;

function BudgetsView(): React.ReactElement {
  const controller = new AbortController();
  const { getItem, setItem } = useLocalStorage();
  const { sendToast } = useContext(ToastContext);
  const { loading, setLoading } = React.useContext(ViewsContext);
  const {
    setContent = () => {},
    setDrawerTitle = () => {},
    setPlacement = () => {},
    openDrawer = () => {},
    setSize = () => {},
    drawerOpen,
  } = React.useContext(DrawerContext);
  const {
    setModalTitle,
    setModalContent = () => {},
    openModal = () => {},
    setWidth,
    setCancelText,
    setOkText,
    modalOpen,
  } = React.useContext(ModalContext);

  const [budgets, setBudgets] = React.useState<BudgetFormObj[]>([]);
  const [year, setYear] = React.useState<any>();

  const onSelectBudget = (budget: BudgetFormObj) => {
    setContent(<BudgetWrapper {...budget} />);
    setDrawerTitle('Informacion de Presupuesto');
    setPlacement('right');
    setSize('large');
    openDrawer();
  };

  const onClickCreate = (budget: BudgetFormObj) => {
    setModalContent(<BudgetForm {...budget} mode="create" />);
    setCancelText('Cancelar');
    setOkText('Guardar')
    setWidth(670);
    setModalTitle('Crear Nuevo Presupuesto');
    openModal();
  };

  const budgetColumns: Column[] = useMemo(
    () => [
      {
        dataIndex: 'date',
        key: 'date',
        title: 'Fecha',
      },
      {
        dataIndex: 'budget',
        key: 'budget',
        title: 'Cantidad',
      },
      {
        dataIndex: 'totalPayment',
        key: 'totalPayment',
        title: 'Pago Total',
      },
      {
        dataIndex: 'remaining',
        key: 'remaining',
        title: 'Restante',
      },
      {
        dataIndex: 'edit',
        key: 'edit',
        title: '',
        render: (_: unknown, record: BudgetFormObj) => (
          <Button onClick={() => onSelectBudget(record)}>Editar</Button>
        ),
      },
    ],
    []
  );

  const getBudgets = async (year: number = new Date().getFullYear()) => {
    try {
      setLoading(true);

      const request = await API.callApi<BudgetFormObj[]>({
        path: '/budgets',
        signal: controller.signal,
        requestType: 'get',
        query: { year },
      });
      if (request.error) {
        const localBudgets: BudgetFormObj[] | null = getItem('budgets', true);
        setBudgets(localBudgets ?? []);
        sendToast('Error', request.error, 'error');
      } else {
        setBudgets(request.result.data);
        setItem('budgets', request.result.data, true);
      }
      setLoading(false);
    } catch (error) {
      controller.abort();
    }
  };

  const onChangeYear = (year: any) => {
    setYear(year);
  };

  const onFilterYear = () => {
    if (year) getBudgets(year.$y);
  };

  React.useEffect(() => {
    if (drawerOpen == false && modalOpen == false) {
      getBudgets();
    }
  }, [drawerOpen, modalOpen]);

  return (
    <Layout>
      <Content>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Title>Presupuestos</Title>
          <Flex>
            <YearPicker
              onChange={onChangeYear}
              placeholder="Seleccionar Año"
              style={{ width: '20vh' }}
              value={year}
              disabled={loading}
            />
            <Button
              size="large"
              onClick={onFilterYear}
              loading={loading}
              disabled={loading}>
              Filtrar
            </Button>
          </Flex>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <Table dataSource={budgets} columns={budgetColumns} bordered />
        )}
      </Content>
      <FloatButton
        style={{ top: 100, bottom: 900 }}
        type="primary"
        icon={<PlusOutlined />}
        shape="square"
        onClick={() =>
          onClickCreate({
            budget: '',
            date: dayjs(),
            exceeded: '',
            paymentsList: [],
            remaining: '',
            totalPayment: '',
            year: String(new Date().getFullYear()),
          })
        }
      />
    </Layout>
  );
}

export default BudgetsView;
