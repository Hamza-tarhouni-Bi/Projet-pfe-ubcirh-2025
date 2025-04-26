import React, { useState } from 'react';
import './Auth.css';
import Navbar from 'components/Navbars/IndexNavbar';
import axios from 'axios';
// Support for both React Router v5 and v6
import { useHistory } from 'react-router-dom'; // For React Router v5

const Signin = () => {
  const history = useHistory(); // Initialize history for redirection in React Router v5
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain both letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear any previous error/success messages when user starts typing again
    setError('');
    setLoginMessage('');
    setLoginSuccess(false);
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginMessage('');
    setShowAlert(false);
    
    // Check if email is empty
    if (!credentials.email) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }
    
    // Check if password is empty
    if (!credentials.password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }
    
    // Validate email format
    if (!validateEmail(credentials.email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }
    
    // Start login request
    setIsLoading(true);
    
    try {
      // Make sure the URL is correct - this is critical
      // If you're using a proxy in package.json, you might not need the full URL
      const apiUrl = '/login'; // Adjust this based on your backend setup
      console.log('Sending login request to:', apiUrl);
      
      const response = await axios.post(apiUrl, credentials);
      console.log('Login response:', response.data);
      
      // Handle successful login
      setIsLoading(false);
      setLoginSuccess(true);
      
      // Handle redirection based on user role
      if (response.data && response.data.personnel) {
        const role = response.data.personnel.role || 'inconnu';
        const message = `Utilisateur existe. Rôle: ${role}`;
        setLoginMessage(message);
        
        // Store user data in localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem('userEmail', credentials.email);
          localStorage.setItem('userRole', role);
        }
        
        // Set a short timeout to show the success message before redirecting
        setTimeout(() => {
          // Redirect based on role
          if (role.toLowerCase() === 'personnel') {
            history.push('/employe');
          } else if (role.toLowerCase() === 'drh') {
            history.push('/admin');
          } else {
            // Default fallback - can be adjusted as needed
            console.log('Unknown role:', role);
            // You might want to redirect to a default page or show an error
          }
        }, 1000); // Redirect after 1 second
      } else {
        const message = 'Utilisateur existe.';
        setLoginMessage(message);
        setShowAlert(true);
      }
      
    } catch (err) {
      setIsLoading(false);
      setLoginSuccess(false);
      
      console.error('Login error:', err);
      
      // Create a clear error message
      let errorMessage = "Erreur de connexion. Veuillez réessayer.";
      
      if (err.response) {
        console.log('Error response:', err.response);
        
        // Handle specific backend error messages
        if (err.response.data && err.response.data.message) {
          if (err.response.data.message.includes("Incorrect email")) {
            errorMessage = "Utilisateur n'existe pas.";
          } else if (err.response.data.message.includes("Incorrect Password")) {
            errorMessage = "Mot de passe incorrect.";
          } else {
            errorMessage = err.response.data.message;
          }
        } else if (err.response.status === 404) {
          errorMessage = "Service non trouvé. Vérifiez l'URL de l'API.";
        } else if (err.response.status === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion.";
      }
      
      setError(errorMessage);
      setShowAlert(true);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Attempting to login with ${provider}`);
    // Here you would implement the actual social login logic
  };

  // Alert component that can be closed
  const Alert = ({ message, type, onClose }) => {
    return (
      <div className={`custom-alert ${type}-alert`}>
        <span>{message}</span>
        <button className="close-alert" onClick={onClose}>×</button>
      </div>
    );
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
              <h3 className="login-title">Connectez-vous à votre compte</h3>
              
              {/* Show alerts */}
              {error && <Alert message={error} type="error" onClose={() => setError('')} />}
              
              {showAlert && loginSuccess && loginMessage && (
                <Alert 
                  message={loginMessage} 
                  type="success" 
                  onClose={() => setShowAlert(false)} 
                />
              )}
              
              <div className="social-login">
                <button 
                  type="button" 
                  className="social-btn linkedin"
                  onClick={() => handleSocialLogin('linkedin')}
                >
                  {/* LinkedIn SVG icon */}
                  <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <span>ou continuer avec</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-container">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Entrez votre adresse email"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <div className="label-row">
                    <label htmlFor="password">Mot de passe</label>
                    <a href="/forgot-password" className="forgot-link">Oublié?</a>
                  </div>
                  <div className="input-container">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Entrez votre mot de passe"
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
                    <span>Se souvenir de moi pendant 30 jours</span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className={`sign-in-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
              
              <div className="help-link">
                <p>Besoin d'aide? <a href="mailto:it-support@ubci.com">Contactez le support</a></p>
              </div>
            </div>
            
            <div className="footer">
              <p>&copy; {new Date().getFullYear()} UBCI. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;