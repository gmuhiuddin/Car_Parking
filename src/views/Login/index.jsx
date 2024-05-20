import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../config/firebase';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLogin(true);
  };

  const handleSignupClick = () => {
    setIsLogin(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (e.target[2].value === e.target[3].value) {

      try {
        await signup(e.target[0].value, e.target[1].value, e.target[2].value);
      } catch (err) {
        alert(err.message);
      };

    } else {
      e.target[3].value = "";
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(e.target[0].value, e.target[1].value);
    } catch (err) {
      alert(err.message);
    };

  };

  return (
    <div className="login-signup-main-container">
      <div className="wrapper">
        <div className="title-text">
          <div className={`title ${isLogin ? 'login' : ''}`}>{isLogin ? "Login" : " Signup "}</div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" checked={isLogin} onChange={handleLoginClick} />
            <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={handleSignupClick} />
            <label htmlFor="login" className={`slide login ${isLogin ? 'active' : ''}`}>Login</label>
            <label htmlFor="signup" className={`slide signup ${!isLogin ? 'active' : ''}`}>Signup</label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">

            {isLogin ? (
              <form onSubmit={handleLogin} className={isLogin ? 'login' : 'signup'}>
                <div className="field">
                  <input type="text" placeholder="Email Address" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Password" required />
                </div>
                {isLogin && <div className="pass-link"><a onClick={() => navigate('/forgotpasspage')}>Forgot password?</a></div>}
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value={isLogin ? 'Login' : 'Signup'} />
                </div>
                {isLogin && <div className="signup-link">Not a member? <a onClick={handleSignupClick}>Signup now</a></div>}
              </form>
            ) : (
              <form onSubmit={handleSignup} className="signup">
                <div className="field">
                  <input type="text" placeholder="Name" required />
                </div>
                <div className="field">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Password" required />
                </div>
                <div className="field">
                  <input type="password" placeholder="Confirm password" required />
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value="Signup" />
                </div>
                {!isLogin && <div className="signup-link">Are you member? <a onClick={handleLoginClick}>login now</a></div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;