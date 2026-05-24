import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { AuthPage } from "../features/auth/AuthPage";
import { BudgetPage } from "../features/budgets/BudgetPage";
import { GoalsPage } from "../features/goals/GoalsPage";
import { RecurringExpensesPage } from "../features/recurring/RecurringExpensesPage";

export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/sign-in", element: <AuthPage mode="sign-in" /> },
  { path: "/sign-up", element: <AuthPage mode="sign-up" /> },
  { path: "/budgets", element: <BudgetPage /> },
  { path: "/goals", element: <GoalsPage /> },
  { path: "/recurring", element: <RecurringExpensesPage /> }
]);
