import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface FormInputRegister {
    email: string;
    password: string;
    username: string;
    fullName: string;
    avatar: any;
    coverImage: any;
    confirmPassword: string;
}

function Register() {
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputRegister>();
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<FormInputRegister> = async (data) => {
        try {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("username", data.username);
            formData.append("fullName", data.fullName);
            formData.append("avatar", data.avatar[0]);
            formData.append("coverImage", data.coverImage[0]);
            await axios.post('/api/v1/user/register', formData).then(() => navigate("/login"));
        } catch (error: any) {
            console.log(error.response.data.message);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="bg-[#2e8286] px-[36px] py-[40px] rounded-[20px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] ">
            <span className="w-[100%] text-red-800 font-semibold text-2xl text-center">{error}</span>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-baseline bg-[#2e8286] gap-[10px]">
                <div className="flex flex-col gap-[5px]">
                    <label>Email</label>
                    <input {...register("email", { pattern: { value: /@/, message: "Please enter valid email address." }, required: { value: true, message: "Full name is required." } })} type="text" placeholder="Enter email." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
                    {errors.email && <span className="text-red-400">{errors.email?.message}</span>}
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>Username</label>
                    <input {...register("username", { minLength: { value: 5, message: "min length is 5" }, required: { value: true, message: "Full name is required." } })} type="text" placeholder="Enter username." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
                    {errors.username && <span className="text-red-400">{errors.username?.message}</span>}
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>Full Name</label>
                    <input {...register("fullName", { required: { value: true, message: "Full name is required." } })} type="text" placeholder="Enter fullname." className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
                    {errors.fullName && <span className="text-red-400">{errors.fullName?.message}</span>}
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>Avatar</label>
                    <input {...register("avatar", { required: { value: true, message: "Avatar file is required." } })} name="avatar" type="file" accept="image/png,image/jpg,image/jpeg,image/gif" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
                    {errors.avatar && <span className="text-red-400">{errors.avatar?.message}</span>}
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>coverImage</label>
                    <input {...register("coverImage")} name="coverImage" type="file" accept="image/png,image/jpg,image/jpeg,image/gif" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3] w-[280px]" />
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>Password</label>
                    <input {...register("password", { required: { value: true, message: "Password is required." } })} type="password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]" />
                    {errors.password && <span className="text-red-400">{errors.password?.message}</span>}
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label>Confirm Password</label>
                    <input {...register("confirmPassword", { required: { value: true, message: "ConfirmPassword is required." } })} type="password" className="rounded-[5px] bg-[#075154] p-[3px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[280px]" />
                    {errors.confirmPassword && <span className="text-red-400">{errors.confirmPassword?.message}</span>}
                </div>
                <input type="submit" className="m-[auto] px-[10px] py-[3px] bg-[#005154] rounded-[5px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]" />
                <div className="">already have an account? <Link to="/login" className="font-bold text-blue-700">Log in</Link></div>
            </form>
        </div>
    );
}

export default Register;