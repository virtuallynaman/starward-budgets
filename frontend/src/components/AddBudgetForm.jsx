import { useState } from 'react';
import axios from "axios";
import { useBudgets } from '../contexts/BudgetContext';
import { toast } from 'sonner';
import { CirclePicker } from 'react-color';
import { useAuth } from '../contexts/AuthProvider';
import { FaRupeeSign } from 'react-icons/fa';

function AddBudgetForm() {
    const [budgetName, setBudgetName] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [color, setColor] = useState("#753cba");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const { fetchBudgets } = useBudgets();
    const { user } = useAuth();

    const colorOptions = [
        '#753cba',
        '#D5451B',
        '#4CAF50',
        '#26C6dA',
        '#FF9B45',
        '#795548',
        '#EC407A',
        '#FFC107',
        '#03A9F4',
        '#138D75',
        '#FF4646',
        '#828282'
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/budgets`, { budgetName, budgetAmount, isRecurring, color }, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            await fetchBudgets();
            setBudgetName("");
            setBudgetAmount("");
            setIsRecurring(false);
            setColor(color);
            toast.success("Budget created successfully!");
        } catch (err) {
            console.error("Error", err);
            toast.error(`${err.message}` || "Something went wrong.");
        }
    };

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        setShowColorPicker(!showColorPicker);
    }

    const handleShowPicker = () => {
        setShowColorPicker(!showColorPicker);
    }

    return (
        <div className='form-wrapper'>
            <h2>Create Budget</h2>
            <form onSubmit={handleSubmit} className='form-group'>
                <label htmlFor="budgetName">Budget Name</label>
                <input
                    id='budgetName'
                    type="text"
                    onChange={(e) => setBudgetName(e.target.value)}
                    value={budgetName}
                    placeholder='e.g., Groceries'
                    autoComplete='off'
                    required
                />
                <label htmlFor="budgetAmount">Amount</label>
                <input
                    id="budgetAmount"
                    type="text"
                    onChange={(e) => setBudgetAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    value={budgetAmount ? `₹ ${budgetAmount}` : ''}
                    placeholder='e.g., ₹3000'
                    inputMode='decimal'
                    className='amount-input'
                    required
                />
            </form>

            <div className='form-options-container'>
                <div className='budget-form-options'>
                    <input
                        type="checkbox" id="recurring" className='checkbox-input'
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        checked={isRecurring}
                    />
                    <label htmlFor="recurring">
                        Recurring Budget
                    </label>
                </div>

                <div className='budget-form-options color-picker-button' onClick={handleShowPicker}>
                    <div className='selected-color' style={{ backgroundColor: `${color}` }}></div>
                    <label className='color-picker-label'>Choose Color</label>

                    {showColorPicker && <CirclePicker color={color} colors={colorOptions} onChange={handleColorChange} />}
                </div>
            </div>

            <button onClick={handleSubmit} className='btn'>Create Budget</button>
        </div>
    )
}

export default AddBudgetForm