import React, { useRef } from "react";

const LoginPage = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const changeHandler = () => {};

  const touchHandler = () => {};

  // The data from the form is collected here
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    console.log([username, password]);
  };
  return (
    <div className="bg-green-400 min-h-screen flex flex-col justify-center">
      <h1 className="text-center text-4xl font-bold mb-5">
        Welcome to RoomService Admin!
      </h1>
      <div className="max-w-sm mx-auto">
        <form
          className="w-full flex flex-col bg-white items-center rounded-2xl p-4"
          onSubmit={handleSubmit}
        >
          <div className="p-3">
            <div className="p-5">
              <label
                className="block font-bold text-rs-green"
                htmlFor="username"
              >
                Username
              </label>
              <input
                ref={usernameRef}
                className="border-0 border-b focus:bg-stone-100 focus:ring-0 focus:border-green-700 focus:text-sm focus:border-b-2 w-80"
                id="username"
                type="text"
                placeholder="Enter your username here"
                onChange={changeHandler}
                onBlur={touchHandler}
              ></input>
            </div>
            <div className="p-5">
              <label
                className="block font-bold text-rs-green"
                htmlFor="password"
              >
                Password
              </label>
              <input
                ref={passwordRef}
                className="border-0 border-b focus:bg-stone-100 focus:ring-0 focus:border-green-700 focus:text-sm focus:border-b-2 w-80"
                id="password"
                type="password"
                placeholder="Enter your password here"
                onChange={changeHandler}
                onBlur={touchHandler}
              ></input>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="border border-4 border-green-700 w-40 rounded-full p-1 text-green-700 font-[700] text-lg hover:text-white hover:bg-green-700"
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
