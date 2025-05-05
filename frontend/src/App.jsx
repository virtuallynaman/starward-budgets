import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Dashboard, { dashboardLoader } from "./pages/Dashboard"
import Error from "./pages/Error"
import MainLayout from "./layouts/MainLayout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        errorElement: <Error />
      }
    ]
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
