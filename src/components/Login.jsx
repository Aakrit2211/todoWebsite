import React, { useState } from "react";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(endpoint, formData);
      onLogin(response.data.user);
    } catch (error) {
      console.error('Auth error:', error);
      const message = error.response?.data?.message || 'Authentication failed';
      alert(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className="container">
      <div className="heading">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          <span>{isLogin ? 'Login' : 'Register'}</span>
        </button>
      </form>

      <div style={{ margin: '20px 0' }}>
        <button onClick={handleGoogleLogin} style={{ backgroundColor: '#db4437' }}>
          <span>Login with Google</span>
        </button>
      </div>

      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#fdcb6e', textDecoration: 'underline' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Login;