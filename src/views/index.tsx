import React from 'react';
import BudgetsView from './Budgets';
import { ReadOutlined } from '@ant-design/icons';
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
      icon: React.createElement(ReadOutlined),
      label: 'Presupuestos',
      key: 'expenses',
    },
  }

export default Views;
