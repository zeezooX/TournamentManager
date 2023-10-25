import Create from "./pages/Create";
import Leaderboard from "./pages/Leaderboard";
import Main from "./pages/Main";
import axios from "axios";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    cyan: {
      main: "#00bbdc",
      contrastText: "#fff",
    },
    orange: {
      main: "#ee7622",
      contrastText: "#fff",
    },
    magenta: {
      main: "#eb008b",
      contrastText: "#fff",
    },
    yellow: {
      main: "#fdbd10",
      contrastText: "#fff",
    },
    blue: {
      main: "#007dda",
      contrastText: "#fff",
    },
    purple: {
      main: "#7a2a8f",
      contrastText: "#fff",
    },
  },
});

const App = () => {
  axios.defaults.baseURL = "http://localhost:8080/api/";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/main" />,
    },
    {
      path: "/create",
      element: <Create />,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
    {
      path: "/main",
      element: <Main />,
    },
    {
      path: "*",
      element: <Navigate to="/main" />,
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
