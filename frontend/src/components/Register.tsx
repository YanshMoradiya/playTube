import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

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

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputRegister>();
    const onSubmit: SubmitHandler<FormInputRegister> = async (data) => {
        try {
            console.log(data.avatar);
            // let formDataForAvatar = new FormData();
            // formDataForAvatar.append("file", data.avatar);
            // let formDataForCoverImage = new FormData();
            // formDataForCoverImage.append("file", data.coverImage);
            // console.log(formDataForAvatar, formDataForCoverImage);
            await axios.post('/api/v1/user/register', { email: data.email, username: data.username, password: data.password, fullName: data.fullName, avatar: data.avatar[0], coverImage: data.coverImage[0] })
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    };
    return (
        <div className="bg-[#2e8286] px-[36px] py-[40px] rounded-[20px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-[#87c0c3]">
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
    )
}

export default Register;