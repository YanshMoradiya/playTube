import { useForm ,SubmitHandler} from "react-hook-form";
import { Link } from "react-router-dom";

interface FormInputLogin {
    email : string;
    password : string;
}

function Login() {
  const { register, handleSubmit } = useForm<FormInputLogin>();
  const onSubmit: SubmitHandler<FormInputLogin> = (data) => console.log(data);

  return (
    <div className=" bg-[#2e8286] px-[36px] py-[40px] rounded-[20px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-baseline bg-[#2e8286] gap-[10px]">
            <div className="flex flex-col gap-[5px]">
                <label>Email/Username</label>
                <input {...register("email")} type="text" placeholder="Enter email or username." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
            </div>
            <div className="flex flex-col gap-[5px]">
                <label>Password</label>
                <input {...register("password")} type="password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]"/>
            </div>
            <input type="submit" className="m-[auto] px-[10px] py-[3px] bg-[#005154] rounded-[5px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]"/>
        <div className="">Don't have an account? <Link to="/register" className="font-bold text-blue-700">Sign up</Link></div>
        </form>
    </div>
  )
}

export default Login