import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header(): JSX.Element {
  const navigate = useNavigate();
  const loginStatus = useSelector(state => state.auth?.logedinStatus);
  return (
    <div className='bg-[#30999e] w-[100%] h-[50px] top-0 flex items-center justify-end sticky z-10'>
      {!loginStatus &&
        <>
          <button className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] px-[5px] py-[8px] rounded-md mx-[5px]" onClick={() => navigate('/register')}>Register</button>
          <button className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] px-[10px] py-[8px] rounded-md mx-[5px]" onClick={() => navigate('/login')}>Login</button>
        </>
      }
    </div>
  )
}

export default Header;