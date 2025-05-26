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
  const [token, setToken] = useState('');
  const [userSalaire, setUserSalaire] = useState(0);
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
        
        const authToken = localStorage.getItem('authToken') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt');
        if (authToken) setToken(authToken);
        
        if (userData.salaire) {
          setUserSalaire(userData.salaire);
        } else {
          showToast("Impossible de déterminer votre salaire. Contactez l'administration.", 'error');
        }
      } catch (e) {
        console.error("Erreur de parsing userData:", e);
        showToast("Erreur de chargement de vos données. Veuillez rafraîchir la page.", 'error');
      }
    }
  }, []);

  const showToast = (message, type = 'success') => {
    console.log(`Toast: ${type} - ${message}`);
    setToast({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'montant') {
      const montant = parseFloat(value);
      if (montant > userSalaire) {
        showToast(`Le montant demandé (${montant} TND) dépasse votre salaire mensuel (${userSalaire} TND)`, 'error');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked");
    
    // Validation
    if (!formData.montant || !formData.motif) {
      showToast("Veuillez remplir tous les champs obligatoires", 'error');
      return;
    }
    
    const montant = parseFloat(formData.montant);
    if (isNaN(montant) || montant <= 0) {
      showToast("Le montant doit être un nombre positif", 'error');
      return;
    }
    
    if (montant > userSalaire) {
      showToast(`Le montant demandé (${montant} TND) dépasse votre salaire mensuel (${userSalaire} TND)`, 'error');
      return;
    }
    
    if (!userData) {
      showToast("Impossible de récupérer vos informations. Veuillez vous reconnecter.", 'error');
      return;
    }
    
    setLoading(true);

    try {
      console.log("Envoi de la demande...");
      const response = await axios.post('/api/adddemandeavance', {
        ...formData,
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        salaire: userSalaire,
        statut: 'En attente'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      console.log("Réponse reçue:", response);
      
      // Modification ici pour gérer spécifiquement le message de succès
      if (response.data.message === "Demande créée avec succès") {
        showToast(response.data.message, 'success');
        setFormData({
          montant: '',
          motif: '',
          type: 'standard',
          statut: 'En attente'
        });
      } else {
        // Tous les autres messages sont considérés comme des erreurs
        showToast(response.data.message || "Erreur lors de la soumission", 'error');
      }
    } catch (err) {
      console.error("Erreur:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Une erreur est survenue lors de la soumission';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Styles
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
    toast: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      color: 'white',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: toast.show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '300px',
      zIndex: 1000,
      backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
    },
    toastMessage: {
      marginRight: '10px'
    },
    toastClose: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '20px'
    }
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
            step="0.01"
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
            minLength="10"
          />
        </div>

        <button 
          type="submit" 
          style={{
            ...styles.submitBtn,
            ...(loading && { backgroundColor: '#94a3b8' })
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = styles.submitBtnHover.backgroundColor)}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = styles.submitBtn.backgroundColor)}
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
        </button>
      </form>

      {/* Toast Notification */}
      <div style={styles.toast}>
        <span style={styles.toastMessage}>{toast.message}</span>
        <button 
          style={styles.toastClose}
          onClick={() => setToast(prev => ({ ...prev, show: false }))}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CardDemandeAvance;