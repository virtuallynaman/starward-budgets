import { useEffect, useState } from 'react';
import axios from 'axios';
import { useBudgets } from '../contexts/BudgetContext';
import { toast } from 'sonner';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useAuth } from '../contexts/AuthProvider';
import { format } from 'date-fns';
import { FaRupeeSign } from 'react-icons/fa';

function AddExpenseForm({ showOption, budgetId }) {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [date, setDate] = useState(format((new Date()), "dd MMM yyyy"));
    const { budgets, fetchExpenses } = useBudgets();
    const { user } = useAuth();

    useEffect(() => {
        if (showOption) {
            setSelectedBudgetId(budgets[0]?.id);
        } else {
            setSelectedBudgetId(budgetId);
        }
    }, [budgets]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/expenses`, { expenseName, expenseAmount, selectedBudgetId, date }, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            await fetchExpenses();
            setExpenseName("");
            setExpenseAmount("");
            setSelectedBudgetId(selectedBudgetId);
            toast.success(`${expenseName} added successfully!`);
        } catch (err) {
            console.error("Error", err);
        }
    };

    return (
        <div className='form-wrapper'>
            <h2>Add New {showOption && budgets?.length < 2 && <span className='accent'>{budgets[0]?.name}</span>} Expense</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <label htmlFor="expenseName">Expense Name</label>
                <input
                    id='expenseName'
                    onChange={(e) => setExpenseName(e.target.value)}
                    value={expenseName}
                    type="text"
                    placeholder='e.g., Veggies'
                    autoComplete='off'
                    required
                />
                <label htmlFor="expenseAmount">Amount</label>
                <input
                    id='expenseAmount'
                    type="text"
                    onChange={(e) => setExpenseAmount(e.target.value.replace(/[^0-9]/g, '')
                    )}
                    value={expenseAmount ? `₹ ${expenseAmount}` : ''}
                    className='amount-input'
                    placeholder='e.g., ₹100'
                    required
                />

                <div className="form-options-container">
                    {showOption && budgets.length > 1 &&
                        <div className='expense-form-options'>
                            <label htmlFor="budgetName">Select Budget</label>
                            <select
                                name="budgetName"
                                id="budgetName"
                                required
                                value={selectedBudgetId || budgets[0]?.id}
                                onChange={(e) => setSelectedBudgetId(e.target.value)}
                            >
                                {budgets.map(budget => (
                                    <option key={budget.id} value={budget.id}>{budget.name}</option>
                                ))}
                            </select>
                        </div>
                    }
                    <div className='expense-form-options'>
                        <label htmlFor="date-picker">Date</label>
                        <DatePicker
                            dateFormat="dd MMM yyyy"
                            selected={date}
                            onChange={(newDate) => {
                                if (!newDate) {
                                    setDate(date);
                                } else {
                                    setDate(format(newDate, "dd MMM y"))
                                }
                            }}
                        />
                    </div>
                </div>
            </form>
            <button onClick={handleSubmit} className='btn '>Add Expense</button>
        </div>

    )
}

export default AddExpenseForm