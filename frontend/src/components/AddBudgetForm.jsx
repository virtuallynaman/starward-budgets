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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/budgets`, { budgetName, budgetAmount, isRecurring, color }, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            await fetchBudgets();
            setBudgetName("");
            setBudgetAmount("");
            setIsRecurring(false);
            toast.success("Budget created successfully!");
        } catch (err) {
            console.error("Error", err);
            toast.error(`${err.message}` || "Something went wrong.");
        }
    };

    // const handleColorChange = (newColor) => {
    //     setColor(newColor.hex);
    //     setShowColorPicker(!showColorPicker);
    // }

    // const handleShowPicker = () => {
    //     setShowColorPicker(!showColorPicker);
    // }

    return (
        <div className='form-wrapper'>
            <h2>Create Budget</h2>
            <form onSubmit={handleSubmit} className='form'>
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
                    type="number"
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    value={budgetAmount}
                    placeholder='e.g., ₹3000'
                    inputMode='decimal'
                    className='amount-input'
                    required
                />
                <FaRupeeSign className='rupee-symbol' />
            </form>

            <div className='form-options-wrapper'>
                <div className='form-options'>
                    <input
                        type="checkbox" id="recurring" className='checkbox-input'
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        checked={isRecurring}
                    />
                    <label htmlFor="recurring">
                        Recurring Budget
                    </label>
                </div>

                {/* <div className='form-options color-picker-button' onClick={handleShowPicker}>
                    <div className='selected-color' style={{ backgroundColor: `${color}` }}></div>
                    <label>Choose color</label>

                    {showColorPicker && <div className='color-picker'><CirclePicker color={color} onChange={handleColorChange} /></div>}
                </div> */}
            </div>

            <button onClick={handleSubmit} className='btn'>Create Budget</button>
        </div>
    )
}

export default AddBudgetForm