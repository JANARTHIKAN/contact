import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, userId } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        alert("Login successful!");
        navigate('/contacts');
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };


  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Welcome back!</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot Password</a>
          </div>
          <button type="submit" className="login-button">Sign In</button>
          <button className="google-login-button">Sign In with Google</button>
        </form>
        <p>
          Don’t have an account?{" "}
          <span onClick={goToSignup} className="signup-link">
            Sign up
          </span>
        </p>
      </div>
      <div className="login-image-container"></div>
    </div>
  );
};

export default Login;
