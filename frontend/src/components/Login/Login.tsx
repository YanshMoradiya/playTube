import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setToken } from "../../store/authSlice";
import authService from "../../services/user.services";
import userServices from "../../services/user.services";
import { IonIcon } from '@ionic/react';


interface FormInputLogin {
  email: string;
  password: string;
}

function Login({ closeButton = false }: { closeButton: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputLogin>();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const onSubmit: SubmitHandler<FormInputLogin> = async (data) => {
    await authService.login(data.email, data.password)
      .then((response) => { dispatch(setToken(response.accessToken)); navigate(from); })
      .catch((error) => (setError(error)));
  }

  useEffect(() => {
    (async () => {
      await userServices.refershAccessToken().then((responce) => { console.log(responce); dispatch(setToken(responce.accessToken)); navigate(from, { replace: true }); });
    })();
  }, []);

  return (
    <div className="bg-[#2e8286] px-[36px] py-[40px] rounded-[20px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] flex flex-col items-end">
      {closeButton && <button onClick={() => navigate(from)}><IonIcon className="text-3xl text-black" name="close-outline" /></button>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-baseline bg-[#2e8286] gap-[10px]">
        {error.length != 0 && <span className="text-red-700">{error}</span>}
        <div className="flex flex-col gap-[5px]">
          <label>Email/Username</label>
          <input {...register("email", { pattern: { value: /@/, message: "Please enter valid email address." }, required: { value: true, message: "email or username name is required." } })} type="text" placeholder="Enter email or username." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
          {errors.email && <span className="text-red-400">{errors.email?.message}</span>}
        </div>
        <div className="flex flex-col gap-[5px]">
          <label>Password</label>
          <input {...register("password", { required: { value: true, message: "Password is required." } })} type="password" placeholder="Enter password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]" />
          {errors.password && <span className="text-red-400">{errors.password?.message}</span>}
        </div>
        <input type="submit" className="m-[auto] px-[10px] py-[3px] bg-[#005154] rounded-[5px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]" />
        <div className="">Don't have an account? <Link to="/register" className="font-bold text-blue-700">Sign up</Link></div>
      </form>
    </div>
  )
}

export default Login