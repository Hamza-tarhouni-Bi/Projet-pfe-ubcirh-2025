import React, { useState, useRef } from 'react';

const CardDemandeConge = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'congé payé',
    notes: '',
    medicalFile: null
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  
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
    successAlert: {
      backgroundColor: '#dcfce7',
      borderRadius: '8px',
      padding: '18px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    successIcon: {
      color: '#16a34a',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    successText: {
      color: '#166534',
      fontSize: '17px',
      fontWeight: '600',
      margin: '0'
    },
    summaryTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e40af',
      marginBottom: '25px',
      textAlign: 'center'
    },
    summaryCard: {
      backgroundColor: '#f8fafc',
      padding: '30px',
      borderRadius: '10px',
      marginBottom: '30px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px'
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '6px',
      fontWeight: '500'
    },
    summaryValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#334155'
    },
    colSpan2: {
      gridColumn: 'span 2'
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
    }
  };
  
  // Types de congés avec des icônes - Version améliorée
  const congeTypes = [
    {
      type: 'congé payé',
      title: 'Congé Payé Standard',
      description: 'Congé annuel rémunéré',
      remainingDays: 15,
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
      remainingDays: 10,
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation pour congé maladie: fichier requis
    if (formData.type === 'congé maladie' && !formData.medicalFile) {
      alert('Veuillez joindre votre justificatif médical');
      return;
    }
    
    setSubmitted(true);
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
          <p style={styles.subtitle}>Découvrez et soumettez vos demandes de congés en quelques clics</p>
        </div>

        {submitted ? (
          <div style={styles.formContainer}>
            <div style={styles.successAlert}>
              <span style={styles.successIcon}>✓</span>
              <p style={styles.successText}>
                Votre demande de congé a été soumise avec succès!
              </p>
            </div>
            
            <h2 style={styles.summaryTitle}>Récapitulatif de votre demande</h2>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryGrid}>
                <div>
                  <p style={styles.summaryLabel}>Type de congé</p>
                  <p style={styles.summaryValue}>
                    {selectedCongeType?.icon || ''} {selectedCongeType?.title || formData.type}
                  </p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Nombre de jours</p>
                  <p style={styles.summaryValue}>{calculateDays()} jours</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Date de début</p>
                  <p style={styles.summaryValue}>{new Date(formData.startDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Date de fin</p>
                  <p style={styles.summaryValue}>{new Date(formData.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
                
                {isMaladieType ? (
                  <div style={styles.colSpan2}>
                    <p style={styles.summaryLabel}>Justificatif médical</p>
                    <p style={styles.summaryValue}>{fileName || 'Fichier joint'}</p>
                  </div>
                ) : (
                  <div style={styles.colSpan2}>
                    <p style={styles.summaryLabel}>Motif</p>
                    <p style={styles.summaryValue}>{formData.reason}</p>
                  </div>
                )}
                
                {formData.notes && (
                  <div style={styles.colSpan2}>
                    <p style={styles.summaryLabel}>Notes complémentaires</p>
                    <p style={styles.summaryValue}>{formData.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <button 
                onClick={() => setSubmitted(false)} 
                style={{...styles.button, maxWidth: '300px'}}
              >
                Nouvelle demande
              </button>
            </div>
          </div>
        ) : (
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
              
              {/* Afficher un champ de téléchargement de fichier pour le congé maladie, sinon un champ de texte pour le motif */}
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
        )}
      </div>
    </div>
  );
};

export default CardDemandeConge;