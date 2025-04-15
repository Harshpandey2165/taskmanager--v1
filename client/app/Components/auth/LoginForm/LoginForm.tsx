"use client";
import { useUserContext } from "@/context/userContext";
import React from "react";

function LoginForm() {
  const { loginUser, userState, handlerUserInput } = useUserContext();
  const { email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Login to Your Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Login Now. Don't have an account?{" "}
          <a
            href="/register"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Register here
          </a>
        </p>

        <div className="mt-[1rem] flex flex-col gap-1.5">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => handlerUserInput("email")(e)}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col gap-1.5">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => handlerUserInput("password")(e)}
              name="password"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 w-full pr-12"
              placeholder="***************"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
            >
              <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} text-lg`}></i>
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href="/forgot-password"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300 text-sm"
          >
            Forgot password?
          </a>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={!email || !password}
            onClick={loginUser}
            className="mt-[1.5rem] w-full px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors flex items-center justify-center"
          >
            <span>Login Now</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
