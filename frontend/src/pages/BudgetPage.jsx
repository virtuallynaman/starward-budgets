import { useParams } from "react-router-dom"
import BudgetList from "../components/BudgetList"
import { useBudgets } from "../contexts/BudgetContext";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpensesList from "../components/ExpensesList";

function BudgetPage() {
    const { id } = useParams();
    const { budgets, expenses } = useBudgets();

    const budget = budgets.find(b => b.id === id);
    const matchingExpenses = expenses.filter(exp => exp.budget_id === budget.id);

    return (
        <div className="dashboard">
            {budget ? (
                <>
                    <div className="component-wrapper">
                        <h1 className="section-header">{budget.name} overview</h1>
                        <BudgetList budget={budget} showDelete={true} />
                        <AddExpenseForm showOption={false} budgetId={budget.id} />
                        <h1 className="section-header">{budget.name} expenses</h1>
                        {matchingExpenses.length > 0 ? (
                            <ExpensesList expenses={matchingExpenses} showBudgetName={false}/>
                        ) : (
                                    <p className="error-component">No expenses yet</p>
                        )
                        }
                    </div>
                </>
            ) : (
                <p>Budget not found</p>
            )
            }
        </div>
    )
}

export default BudgetPage