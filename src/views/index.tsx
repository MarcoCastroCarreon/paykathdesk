import React from 'react';
import BudgetsView from './Budgets';
import { PieChartOutlined, ReadOutlined } from '@ant-design/icons';
import { ViewKeys, ViewStructure } from './types/view.type';

const Views: Record<ViewKeys, ViewStructure> = {
    'budgets': {
      content: < BudgetsView />,
      icon: React.createElement(ReadOutlined),
      label: 'Presupuestos',
      key: 'budgets',
    },
    'expenses': {
      content: <div></div>,
      icon: React.createElement(PieChartOutlined),
      label: 'Gastos',
      key: 'expenses',
    },
  }

export default Views;
