import React, { useState } from 'react';
import './Auth.css';
import Navbar from 'components/Navbars/IndexNavbar';

const Signin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password.');
      return;
    }
    
    // Simulate login request
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      // For demonstration purposes. In real app, you would handle auth logic here
      console.log('Login attempt:', credentials, 'Remember me:', rememberMe);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Attempting to login with ${provider}`);
    // Here you would implement the actual social login logic
  };

  return (
    <>
 <Navbar/>
    <div className="login-page">
     
      <div className="login-content">
        
        {/* Left panel with only background image */}
        <div className="login-left-panel">
          
          {/* No content here - the background image is applied via CSS */}
        </div>
        
        <div className="login-right-panel">
          <div className="login-form-wrapper">
            <h3 className="login-title">Sign in to your account</h3>
            
            {error && <div className="error-alert">{error}</div>}
            
            <div className="social-login">
              <button 
                type="button" 
                className="social-btn linkedin"
                onClick={() => handleSocialLogin('linkedin')}
              >
                {/* LinkedIn SVG icon */}
                <svg className="icon" viewBox="0 0 24 24" xmlns="data:image/png;base64,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">
                  <path 
                    fill="#0077B5" 
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                LinkedIn
              </button>
              
              <button 
                type="button" 
                className="social-btn google"
                onClick={() => handleSocialLogin('gmail')}
              >
                {/* Google SVG icon */}
                <svg className="icon" viewBox="0 0 24 24" xmlns="data:image/png;base64,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">
                  <path 
                    fill="#EA4335" 
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                  />
                  <path 
                    fill="#34A853" 
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                  />
                  <path 
                    fill="#4A90E2" 
                    d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                  />
                  <path 
                    fill="#FBBC05" 
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                  />
                </svg>
                Google
              </button>
            </div>
            
            <div className="divider">
              <span>or continue with</span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="input-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a href="/forgot-password" className="forgot-link">Forgot?</a>
                </div>
                <div className="input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="remember-option">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <span className="checkmark"></span>
                  <span>Remember me for 30 days</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className={`sign-in-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            
            <div className="help-link">
              <p>Need assistance? <a href="mailto:it-support@ubci.com">Contact support</a></p>
            </div>
          </div>
          
          <div className="footer">
            <p>&copy; {new Date().getFullYear()} UBCI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signin;