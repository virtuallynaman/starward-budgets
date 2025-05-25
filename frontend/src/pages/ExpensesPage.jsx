import ExpensesList from "../components/ExpensesList"
import { useBudgets } from "../contexts/BudgetContext"

function ExpensesPage() {
    const { expenses } = useBudgets();
    return (
        <>
            <div className="dashboard">
                <h1 className="section-header">All Expenses</h1>
                <h3>Total : {expenses.length}</h3>
                {expenses && expenses.length > 0 ? (
                    <ExpensesList expenses={expenses} showBudgetName={true} />
                ) : (
                    <p className="error-component">No expenses yet</p>
                )}
            </div>
        </>
    )
}

export default ExpensesPage