import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import { useAuth } from "../context/LoginContext/LoginContext";
import { paths } from "../paths";

const Layout = () => {
  const { userData } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (userData && !userData.username && pathname !== paths.DASHBOARD) {
      navigate(paths.DASHBOARD);
    }
  }, [pathname, userData, navigate]);
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default Layout;
