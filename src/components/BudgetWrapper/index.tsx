import { useMemo } from 'react';
import { BudgetFormObj } from '../../shared/types/budget.type';
import { Tabs } from 'antd';
import BudgetForm from '../BudgetForm';
import ExpensesList from '../ExpensesList';

const BudgetWrapper = (budget: BudgetFormObj) => {
  const tabs = useMemo(
    () => [
      {
        key: '1',
        label: 'Presupuesto',
        children: <BudgetForm {...budget} mode='update'/>
      },
      {
        key: '2',
        label: 'Gastos',
        children: <ExpensesList />
      },
    ],
    [budget]
  );

  return <Tabs defaultActiveKey='1' items={tabs} />;
};

export default BudgetWrapper;
