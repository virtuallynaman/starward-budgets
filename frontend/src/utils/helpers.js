import { useBudgets } from "../contexts/BudgetContext";

// Format currency
export const formatCurrency = (amount) => {
    const amt = parseFloat(amount);
    return amt.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};

// Calculate spent amount 
export const calculateSpentByBudget = (budgetId) => {
    const { expenses } = useBudgets();

    const totalSpent = expenses
        .filter(exp => exp.budget_id === budgetId)
        .reduce((acc, exp) => acc + Number(exp.amount), 0);

    return totalSpent;
};