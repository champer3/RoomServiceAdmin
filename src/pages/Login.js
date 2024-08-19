import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initializeSocket } from "../socketService";
// import { PageContext } from "../context/PageContext";

const validate = (data) => {
  return String(data)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const LoginPage = () => {
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const changeEmailHandler = (event) => {
    const isValid = validate(event.target.value);
    setEmailIsValid(isValid);
  };
  const changePasswordHandler = (event) => {
    const isValid = event.target.value.length < 6 ? false : true;
    setPasswordIsValid(isValid);
  };

  // The data from the form is collected here
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const postData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/login`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const authToken = response.data.token;

      localStorage.setItem("token", authToken);

      initializeSocket(authToken);
      if (authToken) {
        navigate("/dashboard/");
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response ? err.response.data : err.message
      );
    }

    console.log([email, password]);
  };

  useEffect(()=>{
    localStorage.setItem("token", "");
  },[])
  return (
    <div className="bg-green-400 min-h-screen flex flex-col justify-center">
      <h1 className="text-center text-4xl font-bold mb-5">
        Welcome to RoomService Admin!
      </h1>
      <div className="max-w-sm mx-auto">
        <form
          className="w-full drop-shadow-2xl flex flex-col bg-white items-center rounded-2xl p-4"
          onSubmit={handleSubmit}
        >
          <div className="p-3">
            <div className="p-5">
              <label className="block font-bold text-rs-green" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-2 left-0 focus:-translate-y-1">
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
                <input
                  ref={emailRef}
                  className="pl-7 pr-10 py-2 border-0 border-b focus:bg-stone-100 focus:ring-0 focus:border-green-700 focus:text-sm focus:border-b-2 w-80"
                  id="username"
                  type="text"
                  placeholder="Enter your email here"
                  onChange={changeEmailHandler}
                ></input>
              </div>
            </div>
            <div className="p-5">
              <label
                className="block font-bold text-rs-green focus:scale-105"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-2 left-0 focus:-translate-y-1">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                </span>
                <input
                  ref={passwordRef}
                  className="pl-7 pr-10 py-2 border-0 border-b focus:bg-stone-100 focus:ring-0 focus:border-green-700 focus:text-sm focus:border-b-2 w-80"
                  id="password"
                  type="password"
                  placeholder="Enter your password here"
                  onChange={changePasswordHandler}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!emailIsValid || !passwordIsValid}
              className={`${
                !emailIsValid || !passwordIsValid
                  ? ""
                  : "transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110"
              } border border-4 border-green-600 bg-green-600 w-40  rounded-full  p-1 text-white font-[700] text-lg hover:text-white hover:bg-green-900 hover:border-green-900 disabled:border-stone-400 disabled:transition-none disabled:animation-none disabled:bg-stone-400 disabled:text-white`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
