import { Outlet, useNavigate } from "react-router-dom"
import Header from "./components/Header/Header"
import Navbar from "./components/Navbar/Navbar"
import userServices from "./services/user.services";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToken, setToken } from "./store/authSlice";


function App(): JSX.Element {
  const navigate = useNavigate();
  const logedinStatus = useSelector(state => state.auth.logedinStatus);
  const dispatch = useDispatch();
  const logOutHandler = async () => {
    await userServices.logout();
    dispatch(removeToken());
  };

  useEffect(() => { }, [logedinStatus]);

  useEffect(() => {
    (async () => {
      await userServices.refershAccessToken().then((responce) => { dispatch(setToken(responce.accessToken)) }).catch(errorMessage => { if (errorMessage === "refreshtoken is expired." || errorMessage === "jwt expired") navigate('/login') });
    })();
  }, []);

  return (
    <>
      <Header />
      <div className="h-[100%] flex w-[100%]">
        <Navbar logoutHandler={logOutHandler} />
        <main className="ml-[55px] w-[100%] overflow-scroll">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
