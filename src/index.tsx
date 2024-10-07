import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { LoginProvider } from "./context/LoginContext/LoginContext";
import { GameProvider } from "./context/GameContext/GameContext";
import { paths } from "./paths";
import { theme } from "./theme/theme";
import Layout from "./Layout/Layout";
import Home from "./views/Home/Home";
import Champion from "./components/Champion/Champion";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import Lore from "./views/Lore/Lore";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import Hangman from "./views/Hangman/Hangman";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <LoginProvider>
      <ThemeProvider theme={theme}>
        <Router basename="/">
          <Routes>
            <Route path={paths.HOME} element={<Layout />}>
              <Route path={paths.HOME} element={<Home />} />
              <Route path={paths.CHAMPION_DETAIL} element={<Champion />} />
              <Route path={paths.LOGIN} element={<LoginPage />} />
              <Route path={paths.LORE} element={<Lore />} />
              <Route
                path={paths.HANGMAN}
                element={
                  <GameProvider>
                    <Hangman />
                  </GameProvider>
                }
              />
              <Route path={paths.RESET_PASSWORD} element={<ForgotPassword />} />
              <Route path={paths.REGISTER} element={<RegisterPage />} />

              <Route path={paths.LORE} element={<Lore />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </LoginProvider>
  </React.StrictMode>
);
