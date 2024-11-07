import { useState, useContext } from "react";
import { AppContext } from "../../context/Context";
import { Checkbox } from "semantic-ui-react";
import Swal from "sweetalert2";
import "./login.css";
import { BsSoundwave } from "react-icons/bs";

function Login({ handleLogin, handleClick, showPassword, setShowPassword }) {
  const { setLoggedInUser, setIsLoggedIn } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const foundUser = await response.json();

      // Store user information in context
      setLoggedInUser(foundUser);
      setIsLoggedIn(true);
      handleLogin();

      // Reset login data
      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: error.message || "The provided username or password are incorrect. Please try again",
        showCloseButton: "true",
      });
      setLoginData({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="navbar-logo">
        <h1 className="ui large header">
          Mentor<span>Wave</span>
          <BsSoundwave />
        </h1>
      </div>
      <div className="custom-login" id="login-page">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Type your email"
              required
            />
            <i className="mail icon" id="email-icon"></i>
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <br />
            <input
              type={!showPassword ? "password" : "text"}
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Type your password"
              required
            />
            <i className="lock icon" id="password-icon"></i>
          </div>
          <Checkbox
            value={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          <span>{!showPassword ? "Show" : "Hide"} Password</span>
          <p>
            <br />
            Forgot Password? <a>Click here</a>
          </p>
          <button
            type="submit"
            className={
              !loading ? "login-btn" : "ui loading fluid primary button"
            }
            id="sign-in-btn">
            <i className="sign in icon"></i>Login
          </button>
        </form>
        <br />
        <div
          className="ui bottom attached welcome message"
          id="register-message">
          Don't have an account? <a onClick={handleClick}>Register Here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
