import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardDemandeAvance = () => {
  const [formData, setFormData] = useState({
    montant: '',
    motif: '',
    type: 'standard',
    statut: 'En attente'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSalaire, setUserSalaire] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
        setIsAuthenticated(!!userData.email);
        
        const authToken = localStorage.getItem('authToken') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt');
        if (authToken) {
          setToken(authToken);
        }
        
        if (userData.salaire) {
          setUserSalaire(userData.salaire);
        } else {
          console.warn("Salaire non trouvé dans userData");
          setShowAlert(true);
          setAlertType('error');
          setAlertMessage("Impossible de déterminer votre salaire. Contactez l'administration.");
        }
      } catch (e) {
        console.error("Erreur de parsing userData:", e);
      }
    } else {
      console.warn("Aucune donnée utilisateur trouvée");
      setIsAuthenticated(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'montant') {
      const montant = parseFloat(value);
      
      if (montant > userSalaire) {
        setShowAlert(true);
        setAlertType('error');
        setAlertMessage(`Le montant demandé (${montant} TND) dépasse votre salaire mensuel (${userSalaire} TND)`);
      } else if (showAlert && montant <= userSalaire) {
        setShowAlert(false);
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(formData.montant) > userSalaire) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage(`Le montant demandé (${formData.montant} TND) dépasse votre salaire mensuel (${userSalaire} TND)`);
      return;
    }
    
    if (!userData) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage("Impossible de récupérer vos informations. Veuillez vous reconnecter.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const demandeData = {
        ...formData,
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        salaire: userSalaire,
        statut: 'En attente'
      };

      const response = await axios.post(
        '/adddemandeavance',
        demandeData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setConfirmationMessage('Votre demande d\'avance a été soumise avec succès! Statut: En attente');
        setShowConfirmation(true);
        
        setFormData({
          montant: '',
          motif: '',
          type: 'standard',
          statut: 'En attente'
        });

        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage(err.response?.data?.message || err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      padding: '20px 0' 
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e40af',
      margin: '0 0 10px 0',
      position: 'relative',
      display: 'inline-block',
      paddingBottom: '15px'
    },
    titleAfter: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: '4px',
      background: 'linear-gradient(90deg, #1e40af, #3b82f6)',
      borderRadius: '2px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '10px 0 0 0',
      letterSpacing: '0.3px'
    },
    form: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#334155'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      backgroundColor: '#fff',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    infoText: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '5px',
      fontStyle: 'italic'
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderRadius: '4px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
      marginTop: '10px'
    },
    submitBtnHover: {
      backgroundColor: '#1d4ed8'
    },
    loading: {
      display: 'inline-block',
      marginLeft: '10px'
    },
    alert: {
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'opacity 0.3s',
      opacity: 1
    },
    alertError: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderLeft: '4px solid #b91c1c'
    },
    alertSuccess: {
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      borderLeft: '4px solid #16a34a'
    },
    alertIcon: {
      fontSize: '18px',
      marginRight: '10px'
    },
    alertContent: {
      flex: 1
    },
    alertClose: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: 'inherit'
    },
    toastMessage: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#34d399',
      color: 'white',
      borderRadius: '12px',
      padding: '15px 20px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
      animation: 'slideUp 0.3s ease, fadeOut 0.5s ease 2.5s',
      minWidth: '300px',
      maxWidth: '600px'
    },
    toastContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }
  };

  const Alert = ({ type, message, onClose }) => {
    return (
      <div style={{
        ...styles.alert,
        ...(type === 'error' ? styles.alertError : styles.alertSuccess)
      }}>
        <div style={styles.alertContent}>
          <span style={styles.alertIcon}>
            {type === 'error' ? '⚠️' : '✅'}
          </span>
          {message}
        </div>
        <button style={styles.alertClose} onClick={onClose}>×</button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Demande d'avance sur salaire
          <span style={styles.titleAfter}></span>
        </h1>
        <p style={styles.subtitle}>Remplissez ce formulaire pour soumettre votre demande</p>
      </div>

      {showAlert && (
        <Alert 
          type={alertType} 
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="montant">Montant demandé (TND)</label>
          <input
            type="number"
            id="montant"
            name="montant"
            style={styles.input}
            value={formData.montant}
            onChange={handleChange}
            required
            min="1"
            max={userSalaire}
          />
          <p style={styles.infoText}>
            Le montant maximum est de {userSalaire} TND (votre salaire mensuel).
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="type">Type de demande</label>
          <select
            id="type"
            name="type"
            style={styles.select}
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="standard">Standard (traitement sous 3 jours)</option>
            <option value="urgent">Urgente (traitement sous 24h)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="motif">Motif de la demande</label>
          <textarea
            id="motif"
            name="motif"
            style={styles.textarea}
            value={formData.motif}
            onChange={handleChange}
            required
            placeholder="Décrivez brièvement la raison de votre demande d'avance"
          />
        </div>

        <button 
          type="submit" 
          style={styles.submitBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
        </button>
      </form>

      {showConfirmation && (
        <div style={styles.toastMessage}>
          <div style={styles.toastContent}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <strong>Succès! </strong>
              {confirmationMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDemandeAvance;