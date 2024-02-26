import { useForm ,SubmitHandler} from "react-hook-form";
import { Link } from "react-router-dom";

interface FormInputRegister {
    email : string;
    password : string;
    username : string;
    fullName : string;
    avatar : any;
    coverImage:any;
    confirmPassword : string;
}

function Register() {
  const { register, handleSubmit } = useForm<FormInputRegister>();
  const onSubmit: SubmitHandler<FormInputRegister> = (data) => console.log(data);
  return (
    <div className="bg-[#2e8286] px-[36px] py-[40px] rounded-[20px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]">
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-baseline bg-[#2e8286] gap-[10px]">
          <div className="flex flex-col gap-[5px]">
              <label>Email</label>
              <input {...register("email")} type="text" placeholder="Enter email." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>Username</label>
              <input {...register("username")} type="text" placeholder="Enter username." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>Full Name</label>
              <input {...register("fullName")} type="text" placeholder="Enter fullname." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>Avatar</label>
              <input {...register("avatar")} type="file" accept="image/png,image/jpg,image/jpeg,image/gif" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>coverImage</label>
              <input {...register("coverImage")} type="file" accept="image/png,image/jpg,image/jpeg,image/gif" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>Password</label>
              <input {...register("password")} type="password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]"/>
          </div>
          <div className="flex flex-col gap-[5px]">
              <label>Confirm Password</label>
              <input {...register("confirmPassword")} type="password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]"/>
          </div>
          <input type="submit" className="m-[auto] px-[10px] py-[3px] bg-[#005154] rounded-[5px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]"/>
          <div className="">already have an account? <Link to="/login" className="font-bold text-blue-700">Log in</Link></div>
      </form>
  </div>
  )
}

export default Register