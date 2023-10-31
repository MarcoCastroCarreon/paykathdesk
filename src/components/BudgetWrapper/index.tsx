import { useMemo } from 'react';
import { Budget } from '../../shared/types/budget.type';
import { Tabs } from 'antd';
import BudgetForm from '../BudgetForm';
import ExpensesList from '../ExpensesList';

const BudgetWrapper = (budget: Budget) => {
  const tabs = useMemo(
    () => [
      {
        key: '1',
        label: 'Presupuesto',
        children: <BudgetForm {...budget} />
      },
      {
        key: '2',
        label: 'Gastos',
        children: <ExpensesList {...[]} />
      },
    ],
    []
  );

  return <Tabs defaultActiveKey='1' items={tabs} />;
};

export default BudgetWrapper;
