import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signinUser } from "../api/auth";
import { setUser } from "../state/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate()
  useEffect(()=>{
    if(user){
      navigate("/feed")
    }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();
  const dispatch = useDispatch()
  const onSubmit: SubmitHandler<SignInFormInputs> = async(data) => {
    console.log("Sign In Data:", data);

    const response = await signinUser(data)
    if(response.success){
      dispatch(setUser(response.userData))
      navigate('/feed')
    }

  };

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        {/* Email Field */}
        <div className="mb-4">
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

        {/* Password Field */}
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


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign In
        </button>

        {/* Signup Link */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
