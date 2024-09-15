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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
    setIsLoggingIn(true);
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
      const authRole = response.data.data.user.role;
      const authToken = response.data.token;

      localStorage.setItem("token", authToken);
      localStorage.setItem("role", authRole);
      initializeSocket(authToken);
      if (authRole === "admin") {
        navigate("/dashboard/");
      }
      if (authRole === "driver") {
        navigate("/drivers/drivers-dashboard");
      }
    } catch (err) {
      setIsLoggingIn(false);
      console.error(
        "Login failed:",
        err.response ? err.response.data : err.message
      );
    }

    // console.log([email, password]);
  };

  useEffect(() => {
    localStorage.setItem("token", "");
    localStorage.setItem("role", "");
  }, []);
  return (
    <div className="bg-gradient-to-b from-green-500 to-green-700 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-white text-6xl font-bold mb-8 tracking-widest">
        RoomService Admin.
      </h1>
      <div className="w-full max-w-lg bg-white bg-opacity-80 shadow-lg rounded-3xl p-10">
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full mb-6">
            <label
              className="block font-bold text-green-700 text-base mb-2 tracking-wide"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-6 h-6 text-green-600"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-green-400 rounded-full focus:outline-none focus:ring-green-600 focus:border-green-600 focus:bg-green-50 transition duration-200"
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={changeEmailHandler}
              />
            </div>
          </div>

          <div className="w-full mb-6">
            <label
              className="block font-bold text-green-700 text-base mb-2 tracking-wide"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-6 h-6 text-green-600"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-green-400 rounded-full focus:outline-none focus:ring-green-600 focus:border-green-600 focus:bg-green-50 transition duration-200"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={changePasswordHandler}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!emailIsValid || !passwordIsValid}
            className={`${
              !emailIsValid || !passwordIsValid
                ? "bg-green-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition duration-300"
            } text-white font-bold w-full py-3 rounded-full shadow-lg focus:outline-none`}
          >
            {!isLoggingIn ? (
              "Login"
            ) : (
              <div className="">
                <svg
                  className="mx-auto animate-spin"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267"
                    stroke="#ffffff"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>

    // Ayoyemi Hamzat
  );
};

export default LoginPage;
