// import React, { useState } from 'react';

// const Test = () => {
//   const [formData, setFormData] = useState({
//     startDate: '',
//     endDate: '',
//     reason: '',
//     type: 'congé payé',
//     notes: ''
//   });
  
//   const [submitted, setSubmitted] = useState(false);
  
//   // Styles CSS intégrés
//   const styles = {
//     container: {
//       backgroundColor: '#40BFC1', // Couleur turquoise comme dans l'image
//       minHeight: '100vh',
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif'
//     },
//     card: {
//       maxWidth: '800px',
//       margin: '0 auto',
//       backgroundColor: '#FFFFFF',
//       borderRadius: '8px',
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//       overflow: 'hidden'
//     },
//     header: {
//       backgroundColor: '#2A8D99', // Couleur bleu-vert plus foncée pour l'en-tête
//       padding: '20px',
//       color: '#FFFFFF'
//     },
//     title: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       margin: '0'
//     },
//     subtitle: {
//       color: '#E0F7FA',
//       marginTop: '5px',
//       fontSize: '14px'
//     },
//     formContainer: {
//       padding: '24px'
//     },
//     formGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(2, 1fr)',
//       gap: '20px',
//       marginBottom: '24px'
//     },
//     formGroup: {
//       marginBottom: '16px'
//     },
//     label: {
//       display: 'block',
//       marginBottom: '6px',
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#333333'
//     },
//     input: {
//       width: '100%',
//       padding: '10px',
//       border: '1px solid #DDDDDD',
//       borderRadius: '4px',
//       fontSize: '14px'
//     },
//     select: {
//       width: '100%',
//       padding: '10px',
//       border: '1px solid #DDDDDD',
//       borderRadius: '4px',
//       fontSize: '14px',
//       backgroundColor: '#FFFFFF'
//     },
//     textarea: {
//       width: '100%',
//       padding: '10px',
//       border: '1px solid #DDDDDD',
//       borderRadius: '4px',
//       fontSize: '14px',
//       minHeight: '100px',
//       resize: 'vertical'
//     },
//     alert: {
//       backgroundColor: '#E1F5FE',
//       borderLeft: '4px solid #039BE5',
//       padding: '12px',
//       marginBottom: '20px'
//     },
//     alertText: {
//       color: '#0277BD',
//       fontSize: '14px',
//       margin: '0'
//     },
//     buttonContainer: {
//       display: 'flex',
//       justifyContent: 'flex-end',
//       gap: '12px'
//     },
//     cancelButton: {
//       padding: '10px 16px',
//       backgroundColor: '#FFFFFF',
//       color: '#333333',
//       border: '1px solid #DDDDDD',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '14px',
//       fontWeight: '500'
//     },
//     submitButton: {
//       padding: '10px 16px',
//       backgroundColor: '#00838F', // Couleur assortie au thème
//       color: '#FFFFFF',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '14px',
//       fontWeight: '500'
//     },
//     successAlert: {
//       backgroundColor: '#E8F5E9',
//       borderLeft: '4px solid #43A047',
//       padding: '12px',
//       marginBottom: '20px',
//       display: 'flex',
//       alignItems: 'center'
//     },
//     successIcon: {
//       color: '#43A047',
//       marginRight: '8px'
//     },
//     successText: {
//       color: '#2E7D32',
//       fontSize: '14px',
//       margin: '0'
//     },
//     summaryTitle: {
//       fontSize: '18px',
//       fontWeight: '600',
//       color: '#333333',
//       marginBottom: '16px'
//     },
//     summaryCard: {
//       backgroundColor: '#F5F5F5',
//       padding: '16px',
//       borderRadius: '4px',
//       marginBottom: '24px'
//     },
//     summaryGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(2, 1fr)',
//       gap: '16px'
//     },
//     summaryLabel: {
//       fontSize: '12px',
//       color: '#757575',
//       marginBottom: '4px'
//     },
//     summaryValue: {
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#333333'
//     },
//     colSpan2: {
//       gridColumn: 'span 2'
//     }
//   };
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };
  
//   const calculateDays = () => {
//     if (!formData.startDate || !formData.endDate) return 0;
    
//     const start = new Date(formData.startDate);
//     const end = new Date(formData.endDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
//     return diffDays;
//   };
  
//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <h1 style={styles.title}>Demande de Congé</h1>
//           <p style={styles.subtitle}>Remplissez le formulaire ci-dessous pour soumettre votre demande</p>
//         </div>
        
//         {submitted ? (
//           <div style={styles.formContainer}>
//             <div style={styles.successAlert}>
//               <span style={styles.successIcon}>✓</span>
//               <p style={styles.successText}>
//                 Votre demande de congé a été soumise avec succès!
//               </p>
//             </div>
            
//             <h2 style={styles.summaryTitle}>Récapitulatif de votre demande</h2>
            
//             <div style={styles.summaryCard}>
//               <div style={styles.summaryGrid}>
//                 <div>
//                   <p style={styles.summaryLabel}>Type de congé</p>
//                   <p style={styles.summaryValue}>{formData.type}</p>
//                 </div>
//                 <div>
//                   <p style={styles.summaryLabel}>Nombre de jours</p>
//                   <p style={styles.summaryValue}>{calculateDays()} jours</p>
//                 </div>
//                 <div>
//                   <p style={styles.summaryLabel}>Date de début</p>
//                   <p style={styles.summaryValue}>{new Date(formData.startDate).toLocaleDateString('fr-FR')}</p>
//                 </div>
//                 <div>
//                   <p style={styles.summaryLabel}>Date de fin</p>
//                   <p style={styles.summaryValue}>{new Date(formData.endDate).toLocaleDateString('fr-FR')}</p>
//                 </div>
//                 <div style={styles.colSpan2}>
//                   <p style={styles.summaryLabel}>Motif</p>
//                   <p style={styles.summaryValue}>{formData.reason}</p>
//                 </div>
//                 {formData.notes && (
//                   <div style={styles.colSpan2}>
//                     <p style={styles.summaryLabel}>Notes complémentaires</p>
//                     <p style={styles.summaryValue}>{formData.notes}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <button 
//               onClick={() => setSubmitted(false)} 
//               style={styles.submitButton}
//             >
//               Nouvelle demande
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} style={styles.formContainer}>
//             <div style={styles.formGrid}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label} htmlFor="type">
//                   Type de congé
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   value={formData.type}
//                   onChange={handleChange}
//                   style={styles.select}
//                   required
//                 >
//                   <option value="congé payé">Congé payé</option>
//                   <option value="congé sans solde">Congé sans solde</option>
//                   <option value="congé maladie">Congé maladie</option>
//                   <option value="congé maternité">Congé maternité/paternité</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label} htmlFor="reason">
//                   Motif
//                 </label>
//                 <input
//                   type="text"
//                   id="reason"
//                   name="reason"
//                   value={formData.reason}
//                   onChange={handleChange}
//                   style={styles.input}
//                   required
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label} htmlFor="startDate">
//                   Date de début
//                 </label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleChange}
//                   style={styles.input}
//                   required
//                 />
//               </div>
              
//               <div style={styles.formGroup}>
//                 <label style={styles.label} htmlFor="endDate">
//                   Date de fin
//                 </label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleChange}
//                   style={styles.input}
//                   required
//                 />
//               </div>
//             </div>
            
//             {formData.startDate && formData.endDate && (
//               <div style={styles.alert}>
//                 <p style={styles.alertText}>
//                   Durée du congé: <strong>{calculateDays()} jours</strong>
//                 </p>
//               </div>
//             )}
            
//             <div style={styles.formGroup}>
//               <label style={styles.label} htmlFor="notes">
//                 Notes complémentaires (optionnel)
//               </label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 style={styles.textarea}
//               ></textarea>
//             </div>
            
//             <div style={styles.buttonContainer}>
//               <button
//                 type="button"
//                 style={styles.cancelButton}
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 style={styles.submitButton}
//               >
//                 Soumettre la demande
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Test;
//partie precedente  c  est la demande d un congé 

//partie precedente demande d avance sur salaire
import React, { useState } from 'react';

const Test = () => {
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    repaymentMonths: '1',
    repaymentDate: '',
    urgencyLevel: 'normal',
    additionalInfo: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#4a4a4a',
      padding: '20px',
      color: '#FFFFFF'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0'
    },
    subtitle: {
      color: '#f0f0f0',
      marginTop: '5px',
      fontSize: '14px'
    },
    formContainer: {
      padding: '24px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '24px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #DDDDDD',
      borderRadius: '4px',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #DDDDDD',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#FFFFFF'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #DDDDDD',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical'
    },
    radioGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '8px'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      cursor: 'pointer'
    },
    radio: {
      marginRight: '6px'
    },
    infoBox: {
      backgroundColor: '#f5f5f5',
      borderLeft: '4px solid #666666',
      padding: '12px',
      marginBottom: '20px'
    },
    infoText: {
      color: '#333333',
      fontSize: '14px',
      margin: '0'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px'
    },
    cancelButton: {
      padding: '10px 16px',
      backgroundColor: '#FFFFFF',
      color: '#333333',
      border: '1px solid #DDDDDD',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    submitButton: {
      padding: '10px 16px',
      backgroundColor: '#555555',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    successAlert: {
      backgroundColor: '#f5f5f5',
      borderLeft: '4px solid #666666',
      padding: '12px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    successIcon: {
      color: '#666666',
      marginRight: '8px'
    },
    successText: {
      color: '#333333',
      fontSize: '14px',
      margin: '0'
    },
    summaryTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '16px'
    },
    summaryCard: {
      backgroundColor: '#F5F5F5',
      padding: '16px',
      borderRadius: '4px',
      marginBottom: '24px'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#757575',
      marginBottom: '4px'
    },
    summaryValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333333'
    },
    colSpan2: {
      gridColumn: 'span 2'
    },
    progressBar: {
      height: '4px',
      backgroundColor: '#E0E0E0',
      borderRadius: '2px',
      marginTop: '6px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#555555',
      width: '0%',
      transition: 'width 0.3s ease'
    },
    amountContainer: {
      position: 'relative'
    },
    currencySymbol: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#757575'
    },
    amountInput: {
      width: '100%',
      padding: '10px 10px 10px 30px',
      border: '1px solid #DDDDDD',
      borderRadius: '4px',
      fontSize: '14px'
    },
    divider: {
      margin: '24px 0',
      height: '1px',
      backgroundColor: '#EEEEEE'
    },
    formSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '16px'
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  const calculateRepaymentAmount = () => {
    if (!formData.amount) return 0;
    
    const amount = parseFloat(formData.amount);
    const months = parseInt(formData.repaymentMonths);
    
    if (isNaN(amount) || isNaN(months) || months === 0) return 0;
    
    return (amount / months).toFixed(2);
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Demande d'Avance sur Salaire</h1>
          <p style={styles.subtitle}>Remplissez ce formulaire pour demander une avance sur votre salaire</p>
        </div>
        
        {submitted ? (
          <div style={styles.formContainer}>
            <div style={styles.successAlert}>
              <span style={styles.successIcon}>✓</span>
              <p style={styles.successText}>
                Votre demande d'avance sur salaire a été soumise avec succès!
              </p>
            </div>
            
            <h2 style={styles.summaryTitle}>Récapitulatif de votre demande</h2>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryGrid}>
                <div>
                  <p style={styles.summaryLabel}>Montant demandé</p>
                  <p style={styles.summaryValue}>{parseFloat(formData.amount).toLocaleString('fr-FR')} DT</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Durée de remboursement</p>
                  <p style={styles.summaryValue}>{formData.repaymentMonths} mois</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Mensualité</p>
                  <p style={styles.summaryValue}>{calculateRepaymentAmount()} DT/mois</p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Niveau d'urgence</p>
                  <p style={styles.summaryValue}>{
                    formData.urgencyLevel === 'high' ? 'Urgent' : 
                    formData.urgencyLevel === 'medium' ? 'Modéré' : 'Normal'
                  }</p>
                </div>
                <div style={styles.colSpan2}>
                  <p style={styles.summaryLabel}>Motif de la demande</p>
                  <p style={styles.summaryValue}>{formData.reason}</p>
                </div>
                {formData.additionalInfo && (
                  <div style={styles.colSpan2}>
                    <p style={styles.summaryLabel}>Informations complémentaires</p>
                    <p style={styles.summaryValue}>{formData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                Votre demande sera examinée par le service des ressources humaines dans les plus brefs délais. 
                Vous recevrez une notification lorsque celle-ci sera traitée.
              </p>
            </div>
            
            <button 
              onClick={() => setSubmitted(false)} 
              style={styles.submitButton}
            >
              Nouvelle demande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Informations de la demande</h3>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="amount">
                    Montant demandé (DT)
                  </label>
                  <div style={styles.amountContainer}>
                    <span style={styles.currencySymbol}>DT</span>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      style={styles.amountInput}
                      min="100"
                      step="50"
                      required
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="reason">
                    Motif de la demande
                  </label>
                  <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.divider}></div>
            
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Modalités de remboursement</h3>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="repaymentMonths">
                    Durée de remboursement
                  </label>
                  <select
                    id="repaymentMonths"
                    name="repaymentMonths"
                    value={formData.repaymentMonths}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="1">1 mois</option>
                    <option value="2">2 mois</option>
                    <option value="3">3 mois</option>
                    <option value="4">4 mois</option>
                    <option value="5">5 mois</option>
                    <option value="6">6 mois</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="repaymentDate">
                    Date du premier remboursement
                  </label>
                  <input
                    type="date"
                    id="repaymentDate"
                    name="repaymentDate"
                    value={formData.repaymentDate}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              
              {formData.amount && formData.repaymentMonths && (
                <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    Montant mensuel à rembourser: <strong>{calculateRepaymentAmount()} DT</strong>
                  </p>
                </div>
              )}
            </div>
            
            <div style={styles.divider}></div>
            
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Informations complémentaires</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Niveau d'urgence
                </label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value="normal"
                      checked={formData.urgencyLevel === 'normal'}
                      onChange={handleChange}
                      style={styles.radio}
                    />
                    Normal
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value="medium"
                      checked={formData.urgencyLevel === 'medium'}
                      onChange={handleChange}
                      style={styles.radio}
                    />
                    Modéré
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value="high"
                      checked={formData.urgencyLevel === 'high'}
                      onChange={handleChange}
                      style={styles.radio}
                    />
                    Urgent
                  </label>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="additionalInfo">
                  Informations complémentaires (optionnel)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Précisez ici toute information que vous jugez utile pour le traitement de votre demande..."
                ></textarea>
              </div>
            </div>
            
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>Note:</strong> Conformément à la politique de l'entreprise, le montant maximum d'une avance sur salaire 
                est limité à 50% de votre salaire mensuel net. Le remboursement sera effectué par prélèvement 
                automatique sur vos prochains salaires.
              </p>
            </div>
            
            <div style={styles.buttonContainer}>
              <button
                type="button"
                style={styles.cancelButton}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={styles.submitButton}
              >
                Soumettre la demande
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Test;






