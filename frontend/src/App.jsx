import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import RootLayout from "./layouts/RootLayout"
import ExpensesPage from "./pages/ExpensesPage";
import BudgetPage from "./pages/BudgetPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { BudgetProvider } from "./contexts/BudgetContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
    errorElement: <Error />
  },
  {
    path: "/signup",
    element: <PublicRoute><Signup /></PublicRoute>,
    errorElement: <Error />
  },
  {
    path: "/",
    element: <ProtectedRoute><RootLayout /></ProtectedRoute>,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        errorElement: <Error />
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        errorElement: <Error />
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        errorElement: <Error />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" />
  }
]);

function App() {

  return (
    <BudgetProvider>
      <RouterProvider router={router} />
    </BudgetProvider>
  )
}

export default App
