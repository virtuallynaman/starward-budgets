import AddBudgetForm from '../components/AddBudgetForm';
import AddExpenseForm from '../components/AddExpenseForm';
import BudgetList from '../components/BudgetList';
import ExpensesList from '../components/ExpensesList';
import { useBudgets } from '../contexts/BudgetContext';
import Error from './Error';

function Dashboard() {
  const { budgets, expenses, isLoading, loadingBudgets, loadingExpenses, error } = useBudgets();

  return (
    <>
      {isLoading ? (
        <div className="loading-component">
          <span className="loader"></span>
          Loading...
        </div>
      ) : (
        <div className='dashboard'>
          <div className="component-wrapper">

            {error ? <Error /> : <AddBudgetForm />}

            {budgets?.length > 0 &&
              <>
                <AddExpenseForm showOption={true} budgetId={budgets[0].id} />
                <h1 className='section-header'>Existing Budgets</h1>
                {loadingBudgets ? (
                  <div className="loading-component">
                    <span className="loader"></span>
                    Loading...
                  </div>
                ) : (
                  <>
                    {budgets.map((budget) => (
                      <BudgetList key={budget.id} budget={budget} showDelete={false} />
                    ))}
                  </>
                )}
              </>
            }
            {expenses?.length > 0 &&
              <>
                <h1 className='section-header'>Recent Expenses</h1>

                <ExpensesList expenses={expenses.slice(0, 8)} showBudgetName={true} showAllExpenseBtn={true} />
              </>
            }
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard