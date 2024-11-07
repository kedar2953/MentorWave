import { useState, useContext } from "react";
import { AppContext } from "../../context/Context";
import "./login.css";
import Swal from "sweetalert2";
import { Checkbox } from "semantic-ui-react";
import Axios from "axios";
import { BsSoundwave } from "react-icons/bs";

function Registration({ handleRegister, showPassword, setShowPassword }) {
  const { setUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee",
  });

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password when it changes
    if (name === "password") {
      validatePassword(value);
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain letters, numbers, and at least one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true before the request

    // Ensure password is validated before submission
    if (passwordError) {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: passwordError,
      });
      setLoading(false);
      return;
    }

    Axios.post("http://localhost:5000/api/users/signup", formData)
      .then((response) => {
        setUserData(response.data);
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Thank you for registering! Proceed to log in with your new credentials",
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "mentee",
        });
        handleRegister();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : "Sorry, an error occurred during registration.";
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: errorMessage,
        });
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  return (
    <div className="login-container">
      <div className="navbar-logo">
        <h1 className="ui large header">
          Mentor<span>Wave</span>
          <BsSoundwave />
        </h1>
      </div>
      <div id="login-page">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label>Full Names</label>
            <input
              name="name"
              placeholder="Enter your full names"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <i className="user icon" id="user-icon"></i>
          </div>
          <div className="input-field">
            <label>Email</label>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="mail icon" id="email-icon"></i>
          </div>
          <div className="input-field">
            <label>Password</label>
            <input
              type={!showPassword ? "password" : "text"}
              name="password"
              minLength={8}
              placeholder="********"
              title="Password must contain letters, numbers, and special characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="lock icon" id="password-icon"></i>
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
          <div className="input-field">
            <Checkbox
              value={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>{!showPassword ? "Show" : "Hide"} Password</span>
          </div>
          <div className="input-field">
            <label>Account Type</label>
            <select
              name="role"
              className="ui select dropdown register-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          <div className="input-field">
            <span>
              By continuing, you agree to the <a href="#">terms and conditions</a>
            </span>
          </div>
          <button
            type="submit"
            className={!loading ? "register-btn" : "ui fluid loading primary button"}
          >
            <i className="signup icon"></i> Register
          </button>
        </form>
        <div className="ui bottom attached message" id="register-message">
          Already signed up? <a onClick={handleRegister}>Login here</a> instead.
        </div>
      </div>
    </div>
  );
}

export default Registration;
