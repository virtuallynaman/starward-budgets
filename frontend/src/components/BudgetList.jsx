import { Link, useNavigate, } from "react-router-dom";
import { calculateSpentByBudget, formatCurrency } from "../utils/helpers";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { useBudgets } from "../contexts/BudgetContext";

function BudgetList({ budget, showDelete }) {
    const { id, name, amount, color } = budget;
    const spent = calculateSpentByBudget(id);
    const { fetchBudgets, fetchExpenses } = useBudgets();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDeleteBudget = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/budgets/${id}`, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            toast.success(`${name} deleted successfully`);
            navigate("/", { replace: true });
            await fetchBudgets();
            await fetchExpenses();
        } catch (err) {
            console.error("Error deleting budget", err);
            toast.error(`${err.message}` || "Something went wrong");
        }
    }

    return (
        <div className="budget" style={{ '--budget-color': color }}>
            <div className="progress-text">
                <h3>{name}</h3>
                <p>Total Budget: {formatCurrency(amount)}</p>
            </div>
            <progress max={amount} value={spent}>
            </progress>
            <div className="progress-text">
                <small>{formatCurrency(spent)} spent</small>
                <small>{formatCurrency(amount - spent)} remaining</small>
            </div>

            {showDelete ? (
                <button onClick={handleDeleteBudget} className="budget-btn">
                    Delete Budget
                </button>
            ) : (
                <Link to={`/budget/${id}`} className="budget-btn">
                    <span>View Details</span>
                </Link>
            )}
        </div >
    )
}

export default BudgetList