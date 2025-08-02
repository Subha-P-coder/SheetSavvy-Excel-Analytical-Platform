import React, { useContext, useState } from "react";
import person_icon from "../../assets/person_icon.svg";
import mail_icon from "../../assets/mail_icon.svg";
import lock_icon from "../../assets/lock_icon.svg";
import { Navbar } from "../../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      let res;
      if (state === "Sign Up") {
        res = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
      } else {
        res = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
      }

      const data = res.data;
      console.log("Server response:", data);

      if (data.success) {
        toast.success(data.message || `${state} successful!`);
        setIsLoggedIn(true);
        if (res.data.user?.role === "admin") {
          navigate("/admin-secret");
        } else {
          navigate("/dashboard");
        }
        await getUserData();
      } else {
        toast.error(data.message || `${state} failed`);
      }
    } catch (error) {
      console.error("Error:", error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="container">
        <h2>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p>
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="form-container">
              <img className="icon" src={person_icon} alt="person_icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="input"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="form-container">
            <img className="icon" src={mail_icon} alt="mail_icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="input"
              type="email"
              placeholder="Email id"
              required
            />
          </div>

          <div className="form-container">
            <img className="icon" src={lock_icon} alt="lock_icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="input"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="forgot-password"
          >
            Forgot password?
          </p>

          <button className="custom-button">{state}</button>
        </form>

        {state === "Sign Up" ? (
          <p className="custom-text">
            Already have an account?{" "}
            <span onClick={() => setState("Login")} className="custom-span">
              Login here
            </span>
          </p>
        ) : (
          <p className="custom-text">
            Don't have an account?{" "}
            <span onClick={() => setState("Sign Up")} className="custom-span">
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
