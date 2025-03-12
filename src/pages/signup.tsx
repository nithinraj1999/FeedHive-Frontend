import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";
type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
};

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async(data: SignupFormData) => {
    const response = await registerUser(data)
    console.log(response);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md "
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {/* First Name & Last Name in same row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium">First Name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4 mt-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            {...register("dateOfBirth", { required: "Date of birth is required" })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        <p>Have an account?{" "}<Link to="/" className="text-blue-500 hover:underline">sign in </Link></p>
        
      </form>
    </div>
  );
};

export default Signup;
