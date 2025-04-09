import React, { useState } from 'react';

const SalaryAdvanceRequest = () => {
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
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#3b82f6',
      marginBottom: '8px'
    },
    divider: {
      width: '120px',
      height: '4px',
      backgroundColor: '#3b82f6',
      margin: '8px auto'
    },
    form: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#334155'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      backgroundColor: '#fff'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical'
    },
    infoText: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '4px'
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderRadius: '6px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Demande d'avance sur salaire</h1>
        <div style={styles.divider}></div>
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

export default SalaryAdvanceRequest;