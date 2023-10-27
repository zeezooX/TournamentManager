import Create from "./pages/Create";
import Leaderboard from "./pages/Leaderboard";
import Standings from "./pages/Standings";
import Main from "./pages/Main";
import Draw from "./pages/Draw";
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
  axios.defaults.baseURL = "api/";

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
      path: "/standings",
      element: <Standings />,
    },
    {
      path: "/main",
      element: <Main />,
    },
    {
      path: "/draw",
      element: <Draw />,
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
