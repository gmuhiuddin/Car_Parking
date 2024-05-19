import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLogin(true);
  };

  const handleSignupClick = () => {
    setIsLogin(false);
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
          
          {isLogin? (
            <form action="#" className={isLogin ? 'login' : 'signup'}>
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
            <form action="#" className="signup">
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
}

export default LoginForm;