import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CardDemandeConge = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'congé payé',
    notes: '',
    medicalFile: null
  });
  
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    soldedeconge: 0
  });

  // Styles (identique à votre version originale)
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
    selectContainer: {
      position: 'relative'
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      appearance: 'none',
      paddingRight: '40px',
      backgroundColor: '#ffffff'
    },
    selectArrow: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
      pointerEvents: 'none',
      width: '12px',
      height: '12px',
      borderLeft: '2px solid #64748b',
      borderBottom: '2px solid #64748b',
      transform: 'translateY(-70%) rotate(-45deg)'
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
      backgroundColor: '#e0f2fe',
      borderRadius: '8px',
      padding: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
    },
    alertIcon: {
      color: '#0369a1',
      fontSize: '18px'
    },
    alertText: {
      color: '#0369a1',
      fontSize: '15px',
      fontWeight: '500',
      margin: '0'
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
    fileInputContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    fileInput: {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 14px',
      border: '1px dashed #3b82f6',
      borderRadius: '8px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '50px'
    },
    selectedFile: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#f1f5f9',
      borderRadius: '6px',
      fontSize: '14px'
    },
    fileIcon: {
      fontSize: '20px',
      color: '#3b82f6'
    },
    fileInfo: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '0 5px'
    },
    toastMessage: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#34d399',
      color: 'white',
      borderRadius: '12px',
      padding: '5px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: '1000',
      animation: 'slideUp 0.3s ease, fadeOut 0.5s ease 2.5s',
      minWidth: '300px',
      maxWidth: '600px'
    },
    toastContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '15px 20px'
    },
    toastIcon: {
      fontSize: '1.2rem',
      backgroundColor: 'white',
      color: '#34d399',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0'
    }
  };

  // Types de congés avec des icônes (mis à jour avec le solde réel)
  const congeTypes = [
    {
      type: 'congé payé',
      title: 'Congé Payé Standard',
      description: 'Congé annuel rémunéré',
      remainingDays: userData.soldedeconge,
      icon: '🏖️'
    },
    {
      type: 'rtt',
      title: 'RTT',
      description: 'Réduction du temps de travail',
      remainingDays: 8,
      icon: '⏱️'
    },
    {
      type: 'congé maladie',
      title: 'Congé Maladie',
      description: 'Absence pour raison médicale',
      remainingDays: 'Illimité',
      icon: '🏥'
    },
    {
      type: 'congé parental',
      title: 'Congé Parental',
      description: 'Congé pour s\'occuper d\'un enfant',
      remainingDays: 'Selon droits',
      icon: '👶'
    },
    {
      type: 'congé familial',
      title: 'Événement Familial',
      description: 'Mariage, naissance, décès',
      remainingDays: 'Selon événement',
      icon: '👪'
    },
    {
      type: 'congé sans solde',
      title: 'Congé Sans Solde',
      description: 'Absence autorisée non rémunérée',
      remainingDays: 'Illimité',
      icon: '📅'
    },
    {
      type: 'télétravail',
      title: 'Télétravail Exceptionnel',
      description: 'Journée de travail à distance',
      remainingDays: 'Selon accord',
      icon: '🏠'
    }
  ];

  // Récupération des données utilisateur depuis le token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserData({
          nom: decoded.nom,
          prenom: decoded.prenom,
          email: decoded.email,
          soldedeconge: decoded.soldedeconge || 0
        });
      } catch (error) {
        console.error("Erreur de décodage du token", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        medicalFile: file
      }));
      setFileName(file.name);
    }
  };
  
  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      medicalFile: null
    }));
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.type === 'congé maladie' && !formData.medicalFile) {
      alert('Veuillez joindre votre justificatif médical');
      return;
    }
  
    const daysRequested = calculateDays();
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Ajoutez les champs nécessaires
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('reason', formData.reason || '');
      formDataToSend.append('notes', formData.notes || '');
      
      if (formData.medicalFile) {
        formDataToSend.append('medicalFile', formData.medicalFile);
      }
  
      const response = await axios.post(
        '/adddemandeconge', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Succès
      setConfirmationMessage(`Demande de ${formData.type} du ${formData.startDate} au ${formData.endDate} enregistrée !`);
      setShowConfirmation(true);
      
      // Réinitialisation
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'congé payé',
        notes: '',
        medicalFile: null
      });
      setFileName('');
  
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la soumission";
      alert(errorMessage);
    }
  };
  
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  // Trouver les informations du type de congé sélectionné
  const selectedCongeType = congeTypes.find(conge => conge.type === formData.type);
  const isMaladieType = formData.type === 'congé maladie';
  const needsJustification = ['congé maladie', 'congé familial'].includes(formData.type);
  
  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Demande de Congé
            <span style={styles.titleAfter}></span>
          </h1>
          <p style={styles.subtitle}>Bonjour {userData.prenom} {userData.nom}, découvrez et soumettez vos demandes de congés en quelques clics</p>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Formulaire de demande de congé</h2>
            <p style={styles.formDescription}>Veuillez remplir tous les champs obligatoires</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="type">
                Type de congé
              </label>
              <div style={styles.selectContainer}>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  {congeTypes.map((conge, index) => (
                    <option key={index} value={conge.type}>
                      {conge.icon} {conge.title}
                    </option>
                  ))}
                </select>
                <div style={styles.selectArrow}></div>
              </div>
              <span style={styles.congeInfoTag}>
                {selectedCongeType?.description} - 
                {typeof selectedCongeType?.remainingDays === 'number' 
                  ? ` ${selectedCongeType.remainingDays} jours disponibles` 
                  : ` ${selectedCongeType?.remainingDays}`}
              </span>
            </div>
            
            {isMaladieType ? (
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="medicalFile">
                  Justificatif médical *
                </label>
                <div style={styles.fileInputContainer}>
                  <label style={styles.fileInputLabel} htmlFor="medicalFile">
                    {formData.medicalFile ? 'Changer de fichier' : 'Joindre votre justificatif médical'}
                  </label>
                  <input
                    type="file"
                    id="medicalFile"
                    ref={fileInputRef}
                    style={styles.fileInput}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {formData.medicalFile && (
                  <div style={styles.selectedFile}>
                    <span style={styles.fileIcon}>📄</span>
                    <span style={styles.fileInfo}>{fileName}</span>
                    <button 
                      type="button" 
                      style={styles.removeButton}
                      onClick={removeFile}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="reason">
                  Motif {needsJustification && '*'}
                </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder={needsJustification 
                    ? "Précisez le motif (obligatoire)" 
                    : "Précisez le motif de votre demande (facultatif)"}
                  required={needsJustification}
                />
              </div>
            )}
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="startDate">
                  Date de début
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="endDate">
                  Date de fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>
            
            {formData.startDate && formData.endDate && (
              <div style={styles.alert}>
                <span style={styles.alertIcon}>ℹ️</span>
                <p style={styles.alertText}>
                  Durée: <strong>{calculateDays()} jours</strong>
                  {formData.type === 'congé payé' && (
                    <span> - Solde restant: {userData.soldedeconge - calculateDays()} jours</span>
                  )}
                </p>
              </div>
            )}
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="notes">
                Notes complémentaires
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Informations additionnelles (facultatif)"
              />
            </div>
            
            <div style={styles.buttonContainer}>
              <button type="submit" style={styles.button}>
                Soumettre la demande
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast de confirmation */}
      {showConfirmation && (
        <div style={styles.toastMessage}>
          <div style={styles.toastContent}>
            <span style={styles.toastIcon}>✓</span>
            <p>{confirmationMessage}</p>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        `}
      </style>
    </div>
  );
};

export default CardDemandeConge;