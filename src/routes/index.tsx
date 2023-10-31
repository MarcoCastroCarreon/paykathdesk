import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import BudgetView from '../views/Budget';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <BudgetView />,
                path:'/budgets/:budgetId'
            }
        ]
    }
]);

export default router;