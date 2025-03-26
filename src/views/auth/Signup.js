import React, { useState } from 'react';
import './Auth.css';
import Navbar from 'components/Navbars/IndexNavbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic form validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    
    // Simulate registration request
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      // For demonstration purposes. In real app, you would handle registration logic here
      console.log('Registration attempt:', formData, 'Accept terms:', acceptTerms);
    }, 1500);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Attempting to signup with ${provider}`);
    // Here you would implement the actual social signup logic
  };

  return (
    <>
      <Navbar/>
      <div className="signup-page">
        <div className="signup-content">
          {/* Left panel with only background image */}
          <div className="signup-left-panel">
            {/* No content here - the background image is applied via CSS */}
          </div>
          
          <div className="signup-right-panel">
            <div className="signup-form-wrapper">
              <h3 className="signup-title">Create an account</h3>
              
              {error && <div className="error-alert">{error}</div>}
              
              <div className="social-signup">
                <button 
                  type="button" 
                  className="social-btn linkedin"
                  onClick={() => handleSocialSignup('linkedin')}
                >
                  {/* LinkedIn SVG icon */}
                  <svg className="icon" viewBox="0 0 24 24">
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
                  onClick={() => handleSocialSignup('gmail')}
                >
                  {/* Google SVG icon */}
                  <svg className="icon" viewBox="0 0 24 24">
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
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-container">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-container">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-container">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="terms-option">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={() => setAcceptTerms(!acceptTerms)}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    <span>I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and <a href="/privacy" className="terms-link">Privacy Policy</a></span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className={`signup-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              
              <div className="help-link">
                <p>Already have an account? <a href="/signin">Sign in</a></p>
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

export default Signup;