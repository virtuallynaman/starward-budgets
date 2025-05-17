import { useBudgets } from "../contexts/BudgetContext"
import { formatCurrency } from "../utils/helpers"
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { format } from "date-fns";

function ExpensesList({ expenses, showBudgetName, showAllExpenseBtn }) {
    const { budgets, fetchExpenses, loadingExpenses } = useBudgets();
    const { user } = useAuth();


    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/expenses/${id}`, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            await fetchExpenses();
            toast.success("Expense deleted successfully");
        } catch (err) {
            console.error("Error deleting expense", err);
            toast.error(`${err.message}` || "Something went wrong");
        }
    }


    return (
        <>
            <table>
                <thead>
                    {showBudgetName ?
                        <tr>
                            {["Name", "Amount", "Date", "Budget", ""].map((i, index) => (
                                <th key={index}>{i}</th>
                            ))}
                        </tr> :
                        <tr>
                            {["Name", "Amount", "Date", ""].map((i, index) => (
                                <th key={index}>{i}</th>
                            ))}
                        </tr>
                    }
                </thead>

                <tbody>
                    {expenses.map((expense) => {
                        const budget = budgets.find(budget => budget.id === expense.budget_id);

                        return (
                            <tr key={expense.id}>
                                <td>{expense.name}</td>
                                <td>{formatCurrency(expense.amount)}</td>
                                <td>{format(expense.date, "dd MMM yyyy")}</td>
                                {showBudgetName && <td><Link to={`/budget/${budget.id}`} style={{ backgroundColor: `${budget.color}` }}>{budget?.name}</Link></td>}
                                <td>
                                    <button
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        className="btn"
                                        style={{ backgroundColor: "#dd302a" }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>);
                    })}
                </tbody>
                {loadingExpenses &&
                    <div className="expense-loading-overlay">
                        <div className="loading-component">
                            <span className="loader"></span>
                            <p>Refreshing</p>
                        </div>
                    </div>
                }
            </table>
            {showAllExpenseBtn && <Link to="/expenses" className='btn '>View all expenses</Link>}
        </>
    )
}

export default ExpensesList