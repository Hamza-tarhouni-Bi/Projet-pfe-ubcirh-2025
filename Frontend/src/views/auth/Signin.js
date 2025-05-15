import React, { useState } from 'react';
import './Auth.css';
import Navbar from 'components/Navbars/IndexNavbar';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signin = () => {
  const history = useHistory();
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    setError('');
    setLoginMessage('');
    setLoginSuccess(false);
    setShowAlert(false);
  };
  
  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
    setError('');
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginMessage('');
    setShowAlert(false);
    
    if (!credentials.email) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }
    
    if (!credentials.password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }
    
    if (!validateEmail(credentials.email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiUrl = '/login'; 
      console.log('Sending login request to:', apiUrl);
      
      const response = await axios.post(apiUrl, credentials);
      console.log('Login response:', response.data);
      
      setIsLoading(false);
      setLoginSuccess(true);
      
      if (response.data && response.data.personnel) {
        localStorage.setItem('userData', JSON.stringify(response.data.personnel));
        const role = response.data.personnel.role || 'inconnu';
        const message = `Utilisateur existe. Rôle: ${role}`;
        setLoginMessage(message);
        
        setTimeout(() => {
          if (role.toLowerCase() === 'personnel') {
            history.push('/employe');
          } else if (role.toLowerCase() === 'drh') {
            history.push('/admin');
          } else {
            console.log('Unknown role:', role);
          }
        }, 1000);
      } else {
        const message = 'Utilisateur existe.';
        setLoginMessage(message);
        setShowAlert(true);
      }
      
    } catch (err) {
      setIsLoading(false);
      setLoginSuccess(false);
      
      console.error('Login error:', err);
      
      let errorMessage = "Erreur de connexion. Veuillez réessayer.";
      
      if (err.response) {
        console.log('Error response:', err.response);
        
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
        errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion.";
      }
      
      setError(errorMessage);
      setShowAlert(true);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);
    
    if (!forgotEmail) {
      setError('Veuillez saisir votre adresse email.');
      setShowAlert(true);
      return;
    }
    
    if (!validateEmail(forgotEmail)) {
      setError('Veuillez saisir une adresse email valide.');
      setShowAlert(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/forgot-password', { email: forgotEmail });
      
      if (response.data.success) {
        setToastType('success');
        setToastMessage(response.data.message);
      } else {
        setToastType('error');
        setToastMessage(response.data.message);
      }
      setShowToast(true);
      
      if (response.data.success) {
        setTimeout(() => {
          setShowToast(false);
          setMode('login');
          setForgotEmail('');
        }, 5000);
      } else {
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
      
    } catch (err) {
      let errorMessage = "Erreur lors de la réinitialisation. Veuillez réessayer.";
      
      if (err.response) {
        switch(err.response.status) {
          case 400:
            errorMessage = "Adresse email invalide";
            break;
          case 404:
            errorMessage = "Aucun compte trouvé avec cette adresse email";
            break;
          case 500:
            errorMessage = "Erreur serveur. Veuillez réessayer plus tard";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur. Vérifiez votre connexion.";
      }
      
      setToastType('error');
      setToastMessage(errorMessage);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    history.push('/signin');
  };

  const Alert = ({ message, type, onClose }) => {
    return (
      <div className={`custom-alert ${type}-alert`}>
        <span>{message}</span>
        <button className="close-alert" onClick={onClose}>×</button>
      </div>
    );
  };
  
  const Toast = ({ message, type, onClose }) => {
    return (
      <div className={`toast-notification ${type}-toast`}>
        <div className="toast-content">
          {type === 'success' && (
            <div className="toast-icon success">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className="toast-icon error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
              </svg>
            </div>
          )}
          <div className="toast-message">{message}</div>
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    );
  };

  return (
    <>
      <Navbar/>
      <div className="login-page">
        <div className="login-content">
          <div className="login-left-panel"></div>
          
          <div className="login-right-panel">
            <div className="login-form-wrapper">
              <div className="login-header">
                <h3 className="login-title">
                  {mode === 'login' ? 'Connectez-vous à votre compte' : 'Réinitialisation du mot de passe'}
                </h3>
                <p className="login-subtitle">
                  {mode === 'login' ? 
                    '' : 
                    ''}
                </p>
              </div>
              
              {error && <Alert message={error} type="error" onClose={() => setError('')} />}
              
              {showAlert && loginSuccess && loginMessage && (
                <Alert 
                  message={loginMessage} 
                  type="success" 
                  onClose={() => setShowAlert(false)} 
                />
              )}
              
              {showToast && (
                <Toast 
                  message={toastMessage} 
                  type={toastType} 
                  onClose={() => setShowToast(false)} 
                />
              )}
              
              {mode === 'login' ? (
                <form onSubmit={handleSubmit} className="auth-form">
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
                      <div className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <div className="label-row">
                      <label htmlFor="password">Mot de passe</label>
                      <a 
                        href="#" 
                        className="forgot-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setMode('forgot');
                        }}
                      >
                        Oublié?
                      </a>
                    </div>
                    <div className="input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Entrez votre mot de passe"
                        disabled={isLoading}
                      />
                      <div className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="remember-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      />
                      <span className="checkmark"></span>
                      <span>Afficher le Mot de passe</span>
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
              ) : (
                <form onSubmit={handleForgotPassword} className="forgot-password-form">
                  <div className="input-group">
                    <label htmlFor="forgotEmail">Email</label>
                    <div className="input-container">
                      <input
                        type="email"
                        id="forgotEmail"
                        name="forgotEmail"
                        value={forgotEmail}
                        onChange={handleForgotEmailChange}
                        placeholder="Entrez votre adresse email"
                        disabled={isLoading}
                      />
                      <div className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="forgot-actions">
                    <button 
                      type="button" 
                      className="back-btn"
                      onClick={() => setMode('login')}
                      disabled={isLoading}
                    >
                      Retour
                    </button>
                    
                    <button 
                      type="submit" 
                      className={`forgot-btn ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Envoi...' : 'Envoyer un mail'}
                    </button>
                  </div>
                </form>
              )}
              
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