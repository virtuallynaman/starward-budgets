// Import npm packages
import express from "express";
import pg from "pg";
import cors from "cors";
import "dotenv/config";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import requireAuth from "./middleware/requireAuth.js";

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Database connection
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect()
    .then(console.log("Connected to the database"))
    .catch((err) => console.log("Database connection error", err));


// ====================
// Functions
// ====================

// Capitalize each word of the name
function capitalizeName(str) {
    if (!str) return "";
    return str
        .toLowerCase
        .split(" ")
        .map(str => str.charAt(0).toUpperCase() + str.slice(1))
        .join(" ");
}

// Capitalize the first letter of the budget or expense name
function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create a new user
async function createUser(name, email, hashedPassword) {
    const result = await db.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;", [capitalizeName(name), email, hashedPassword]);
    return result.rows[0];
}

// Get all the budgets function
async function getAllBudgets(user_id) {
    const result = await db.query("SELECT * FROM budgets WHERE user_id = $1 ORDER BY amount DESC;", [user_id]);
    return result.rows;
}

// Get all the expenses function
async function getAllExpenses(user_id) {
    const result = await db.query("SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC;", [user_id]);
    return result.rows;
}

// Sign up route
app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ error: true, message: "Please fill all the fields" })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: "Please enter a valid email address" });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: true, message: "Password is not strong enough" });
    }

    try {
        const isUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (isUser.rows.length > 0) {
            return res.status(400).json({ error: true, message: "This user already exists. Try logging in instead" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashedPassword);

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.status(201).json({ error: false, message: "Registered successfully", email, accessToken, name });
    } catch (err) {
        console.error("Error creating a new user", err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Login route
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
        return res.status(400).json({ error: true, message: "Please fill all the fields" });
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: true, message: "User not found. Please sign up first" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(400).json({ error: true, message: "Incorrect password" });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ error: false, message: "Logged in successfully", email, accessToken, name: user.name });
    } catch (err) {
        console.error("Error logging in", err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Authorization middleware
app.use(requireAuth);

// Get all the budgets
app.get("/api/budgets", async (req, res) => {
    const user_id = req.user.id;

    try {
        const budgets = await getAllBudgets(user_id);
        res.status(200).json(budgets);
    } catch (err) {
        console.error("Error fetching budgets:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all the expenses
app.get("/api/expenses", async (req, res) => {
    const user_id = req.user.id;

    try {
        const expenses = await getAllExpenses(user_id);
        res.status(200).json(expenses);
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new budget
app.post("/api/budgets", async (req, res) => {
    const { budgetName, budgetAmount, isRecurring, color } = req.body;
    const user_id = req.user.id;

    try {
        const newBudget = await db.query("INSERT INTO budgets(name, amount, recurring, color, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *;", [capitalizeFirstLetter(budgetName), budgetAmount, isRecurring, color, user_id]);
        res.status(201).json(newBudget.rows[0]);
    } catch (err) {
        console.error("Error creating budget", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add a new expense
app.post("/api/expenses", async (req, res) => {
    const { expenseName, expenseAmount, selectedBudgetId, date } = req.body;
    const user_id = req.user.id;

    try {
        const newExpense = await db.query("INSERT INTO expenses(name, amount, budget_id, date, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *;", [capitalizeFirstLetter(expenseName), expenseAmount, selectedBudgetId, date, user_id]);
        res.status(201).json(newExpense.rows[0]);
    } catch (err) {
        console.error("Error adding expense", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Delete a budget
app.delete("/api/budgets/:id", async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;

    if (!validator.isUUID(user_id)) {
        return res.status(400).json({ message: "Invalid budget id" });
    }

    try {
        await db.query("DELETE FROM budgets WHERE id = $1 AND user_id = $2;", [id, user_id]);
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (err) {
        console.error("Error deleting budget", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a expense
app.delete("/api/expenses/:id", async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;

    if (!validator.isUUID(user_id)) {
        return res.status(400).json({ message: "Invalid expense id" });
    }

    try {
        await db.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2;", [id, user_id]);
        res.status(200).json({ message: "expense deleted successfully" });
    } catch (err) {
        console.error("Error deleting expense", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Listening to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});