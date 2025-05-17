import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBudgets, setloadingBudgets] = useState(true);
    const [loadingExpenses, setloadingExpenses] = useState(false);
    const [error, setError] = useState(false);
    const { user } = useAuth();

    const fetchBudgets = async () => {
        try {
            setloadingBudgets(true);
            setError(false);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/budgets`, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            setBudgets(response.data);
        } catch (err) {
            console.error("Error", err);
            setError(true);
            toast.error(err.response?.data?.error || "Something went wrong.");
        } finally {
            setloadingBudgets(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            setloadingExpenses(true);
            setError(false);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/expenses`, { headers: { 'Authorization': `Bearer ${user.accessToken}` } });
            setExpenses(response.data);
        } catch (err) {
            console.error("Error", err);
            setError(true);
            toast.error(err.response?.data?.error || "Something went wrong.");
        } finally {
            setloadingExpenses(false);
        }
    }

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchBudgets();
            fetchExpenses();
            setIsLoading(false);
        }
    }, [user]);

    return (
        <BudgetContext.Provider value={{ budgets, expenses, fetchBudgets, fetchExpenses, isLoading, loadingBudgets, loadingExpenses, error }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudgets = () => useContext(BudgetContext)