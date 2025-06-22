import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import FirebaseActionHandler from "./api/firebase/FirebaseActionHandler";
import { LoginProvider } from "./context/LoginContext/LoginContext";
import { GameProvider } from "./context/GameContext/GameContext";
import { ModalProvider } from "./context/ModalContext/ModalProvider";
import { paths } from "./paths";
import { theme } from "./theme/theme";
import Layout from "./Layout/Layout";
import Home from "./views/Home/Home";
import Champion from "./components/Champion/Champion";
import AuthPage from "./views/AuthPage/AuthPage";
import Lore from "./views/Lore/Lore";
import Hangman from "./views/Hangman/Hangman";
import LoginForm from "./views/AuthPage/LoginForm/LoginForm";
import RegisterForm from "./views/AuthPage/RegisterForm/RegisterForm";
import ForgotPassword from "./views/AuthPage/ForgotPassword/ForgotPassword";
import UserDashboard from "./views/UserDashboard/UserDashboard";
import Ranking from "./views/Ranking/Ranking";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <ModalProvider>
          <LoginProvider>
            <Routes>
              <Route path={paths.HOME} element={<Layout />}>
                <Route
                  path="/__/auth/action"
                  element={<FirebaseActionHandler />}
                />
                <Route path={paths.HOME} element={<Home />} />
                <Route path={paths.CHAMPION_DETAIL} element={<Champion />} />
                <Route path={paths.RANKING} element={<Ranking />} />
                <Route
                  path={paths.HANGMAN}
                  element={
                    <GameProvider>
                      <Hangman />
                    </GameProvider>
                  }
                />
                <Route path={paths.AUTH} element={<AuthPage />}>
                  <Route path={paths.LOGIN} element={<LoginForm />} />
                  <Route path={paths.REGISTER} element={<RegisterForm />} />
                  <Route
                    path={paths.RESET_PASSWORD}
                    element={<ForgotPassword />}
                  />
                </Route>

                <Route path={paths.LORE} element={<Lore />} />
                <Route path={paths.DASHBOARD} element={<UserDashboard />} />
              </Route>
            </Routes>
          </LoginProvider>
        </ModalProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
