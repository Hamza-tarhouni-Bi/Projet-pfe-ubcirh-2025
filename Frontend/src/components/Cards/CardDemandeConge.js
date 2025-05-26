import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardDemandeConge = () => {
  // États
  const [formData, setFormData] = useState({
    DateDebut: '',
    DateFin: '',
    motif: '',
    statut: 'En attente',
  });
  
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    soldeConge: 0,
    idpersonnel: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userDataStr = localStorage.getItem('userData');
    
    // Définir la date minimale (aujourd'hui)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
    
    if (userDataStr) {
      try {
        // Correction du format JSON malformé
        const fixedJson = userDataStr
          .replace(/"nom":/g, '"nom":')
          .replace(/"prénom":/g, '"prenom":')
          .replace(/"email":/g, '"email":')
          .replace(/'/g, '"');

        const parsedData = JSON.parse(fixedJson);
        
        setUserData({
          nom: parsedData.nom || '',
          prenom: parsedData.prenom || parsedData['prénom'] || '',
          email: parsedData.email || '',
          soldeConge: parsedData.soldedeconge || 0,
          idpersonnel: parsedData._id || '' // Ajout de l'ID du personnel
        });

        // Récupérer le token
        const authToken = localStorage.getItem('authToken') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt');
        if (authToken) {
          setToken(authToken);
        }
      } catch (e) {
        console.error("Erreur de parsing userData:", e);
        setShowAlert(true);
        setAlertType('error');
        setAlertMessage("Erreur de lecture de vos données utilisateur");
      }
    } else {
      console.warn("Aucune donnée utilisateur trouvée");
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage("Impossible de récupérer vos informations. Veuillez vous reconnecter.");
    }
  }, []);

  const calculateDays = () => {
    if (!formData.DateDebut || !formData.DateFin) return { days: 0, error: '' };

    const start = new Date(formData.DateDebut);
    const end = new Date(formData.DateFin);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return { 
        days: 0, 
        error: 'La date de début ne peut pas être antérieure à aujourd\'hui.' 
      };
    }
    
    if (start > end) {
      return { 
        days: 0, 
        error: 'La date de fin ne peut pas être avant la date de début.' 
      };
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return { days: diffDays, error: '' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si la date de début change, vérifier si la date de fin est toujours valide
    if (name === 'DateDebut' && formData.DateFin && value > formData.DateFin) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        DateFin: value // Réinitialiser la date de fin si elle devient invalide
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.DateDebut || !formData.DateFin || !formData.motif) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    const { days: joursDemandes, error } = calculateDays();
    
    if (error) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage(error);
      setLoading(false);
      return;
    }
    
    // Vérification du solde de congé
    if (joursDemandes > userData.soldeConge) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage(`Votre solde de congé (${userData.soldeConge} jours) est insuffisant pour cette demande (${joursDemandes} jours)`);
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        soldeConge: userData.soldeConge,
        idpersonnel: userData.idpersonnel, // Inclusion de l'ID du personnel
        joursDemandes: joursDemandes
      };

      const response = await axios.post('/api/adddemandeconge', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setConfirmationMessage(response.data.message || 'Votre demande de congé a été soumise avec succès');
      setShowConfirmation(true);
      
      // Réinitialiser le formulaire après succès
      setFormData({
        DateDebut: '',
        DateFin: '',
        motif: '',
        statut: 'En attente'
      });

      // Masquer la confirmation après 5 secondes
      setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);

    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Une erreur s\'est produite lors de la soumission de votre demande');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#334155'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      paddingTop: '8rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '20px 0' 
    },
    title: {
      fontSize: '2.2rem', 
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
      fontSize: '17px',
      color: '#64748b',
      marginTop: '10px',
      margin: '0',
      letterSpacing: '0.3px'
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '35px',
      marginBottom: '35px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)'
    },
    formHeader: {
      marginBottom: '25px',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '15px'
    },
    formTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e40af',
      margin: '0 0 8px 0'
    },
    formDescription: {
      fontSize: '15px',
      color: '#64748b',
      margin: '0'
    },
    userInfoBox: {
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '25px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    userInfoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    userInfoContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    userInfoItem: {
      marginBottom: '5px'
    },
    userInfoLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
      marginBottom: '3px'
    },
    userInfoValue: {
      fontSize: '15px',
      color: '#1e293b',
      fontWeight: '600'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '15px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '20px'
    },
    congeInfoTag: {
      display: 'block',
      fontSize: '14px',
      color: '#64748b',
      marginTop: '5px'
    },
    textarea: {
      width: '100%',
      padding: '12px 14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      minHeight: '100px',
      resize: 'vertical'
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
    alertContent: {
      flex: 1
    },
    alertClose: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: 'inherit',
      padding: '0 10px'
    },
    buttonContainer: {
      marginTop: '25px'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 5px rgba(37, 99, 235, 0.3)'
    },
    buttonDisabled: {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
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
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Demande de Congé
            <span style={styles.titleAfter}></span>
          </h1>
          <p style={styles.subtitle}>Remplissez les informations ci-dessous pour soumettre votre demande de congé.</p>
        </div>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Détails de votre demande de congé</h2>
            <p style={styles.formDescription}>
              Veuillez remplir tous les champs nécessaires avant de soumettre votre demande.
            </p>
          </div>

          {/* Section d'affichage des informations utilisateur */}
          <div style={styles.userInfoBox}>
            <div style={styles.userInfoTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#3B82F6"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#3B82F6"/>
              </svg>
              <span>Vos informations</span>
            </div>
            <div style={styles.userInfoContent}>
              <div style={styles.userInfoItem}>
                <div style={styles.userInfoLabel}>Nom</div>
                <div style={styles.userInfoValue}>{userData.nom || 'Non renseigné'}</div>
              </div>
              <div style={styles.userInfoItem}>
                <div style={styles.userInfoLabel}>Prénom</div>
                <div style={styles.userInfoValue}>{userData.prenom || 'Non renseigné'}</div>
              </div>
              <div style={styles.userInfoItem}>
                <div style={styles.userInfoLabel}>ID Personnel</div>
                <div style={styles.userInfoValue}>{userData.idpersonnel || 'Non renseigné'}</div>
              </div>
              <div style={styles.userInfoItem}>
                <div style={styles.userInfoLabel}>Solde de congé</div>
                <div style={styles.userInfoValue}>{userData.soldeConge} jours disponibles</div>
              </div>
            </div>
          </div>

          {showAlert && (
            <Alert 
              type={alertType} 
              message={alertMessage}
              onClose={() => setShowAlert(false)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de début</label>
                <input
                  type="date"
                  name="DateDebut"
                  value={formData.DateDebut}
                  onChange={handleInputChange}
                  style={styles.input}
                  min={minDate}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de fin</label>
                <input
                  type="date"
                  name="DateFin"
                  value={formData.DateFin}
                  onChange={handleInputChange}
                  style={styles.input}
                  min={formData.DateDebut || minDate}
                  required
                />
                <div style={styles.congeInfoTag}>
                  Nombre de jours demandés: {calculateDays().days} / Solde disponible: {userData.soldeConge}
                </div>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Motif de congé</label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Veuillez décrire le motif de votre demande de congé..."
                required
              />
            </div>
            <div style={styles.buttonContainer}>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
                disabled={loading}
              >
                {loading ? 'Soumission en cours...' : 'Soumettre la demande'}
              </button>
            </div>
          </form>
        </div>
        
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
    </div>
  );
};

export default CardDemandeConge;