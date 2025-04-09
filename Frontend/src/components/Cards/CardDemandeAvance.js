import React, { useState } from 'react';

const CardDemandeAvance = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    amount: '',
    reason: '',
    urgency: 'standard'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous implémenteriez la logique pour soumettre la demande
    console.log('Demande soumise:', formData);
    alert('Votre demande d\'avance sur salaire a été soumise avec succès!');
  };

  const styles = {
    container: {
      width: '100%',
      margin: '0 auto',
      padding: '10px',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '20px 0' 
    },
    title: {
      fontSize: '38px',
      fontWeight: '700',
      color: '#1e40af',
      margin: '0 0 10px 0',
      position: 'relative',
      display: 'inline-block',
      paddingBottom: '15px',
      fontWeight: 'inherit',
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
    form: {
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      padding: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    formGroup: {
      marginBottom: '12px'
    },
    label: {
      display: 'block',
      marginBottom: '4px',
      fontWeight: '500',
      fontSize: '13px',
      color: '#334155'
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '13px'
    },
    select: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '13px',
      backgroundColor: '#fff'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #e2e8f0',
      fontSize: '13px',
      minHeight: '80px',
      resize: 'vertical'
    },
    infoText: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '3px'
    },
    submitBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderRadius: '4px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Demande d'avance sur salaire
          <span style={styles.titleAfter}></span>
        </h1>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="fullName">Nom complet</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            style={styles.input}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="employeeId">Identifiant employé</label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            style={styles.input}
            value={formData.employeeId}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="amount">Montant demandé (TND)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            style={styles.input}
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
          />
          <p style={styles.infoText}>Le montant maximum est de 30% de votre salaire mensuel</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="urgency">Type de demande</label>
          <select
            id="urgency"
            name="urgency"
            style={styles.select}
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value="standard">Standard (traitement sous 3 jours)</option>
            <option value="urgent">Urgente (traitement sous 24h)</option>
            <option value="exceptional">Exceptionnelle (évaluation sous 5 jours)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="reason">Motif de la demande</label>
          <textarea
            id="reason"
            name="reason"
            style={styles.textarea}
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          style={styles.submitBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Soumettre ma demande
        </button>
      </form>
    </div>
  );
};

export default CardDemandeAvance;