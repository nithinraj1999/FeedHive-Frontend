import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const signupSchema = z.object({
  firstName: z.string()
  .min(1, "First name is required")
  .regex(/^[A-Za-z]+$/, "Only letters are allowed"),

  lastName: z.string().min(1, "Last name is required")
  .regex(/^[A-Za-z]+$/, "Only letters are allowed"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits")
  .regex(/^\d+$/, "Only numbers are allowed"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate()
  useEffect(()=>{
    if(user){
      navigate("/feed")
    }
  },[])

  const onSubmit = async (data: SignupFormData) => {
    try{
      const response = await registerUser(data);
      if (response.success) {
        console.log(response.newUserId);
        navigate(`/select-category?userId=${response.newUserId}`);
      }
    }catch(error){
      toast.error("something went wrong", {
              position: "top-right",
              autoClose: 3000,
            });
            console.log(watch);
            
    }

  };

  return (
    <>
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium">First Name</label>
            <input {...register("firstName")} className="w-full p-2 border rounded mt-1" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium">Last Name</label>
            <input {...register("lastName")} className="w-full p-2 border rounded mt-1" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="mb-4 mt-4">
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register("email")} className="w-full p-2 border rounded mt-1" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" {...register("phone")} className="w-full p-2 border rounded mt-1" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input type="date" {...register("dateOfBirth")} className="w-full p-2 border rounded mt-1" />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded mt-1" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input type="password" {...register("confirmPassword")} className="w-full p-2 border rounded mt-1" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-blue-600">
          Sign Up
        </button>

        <p className="mt-4">
          Have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
     <ToastContainer />
    </>
   
  );
};

export default Signup;
