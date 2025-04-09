import React, { useState } from 'react';

const CardDemandeConge = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'congé payé',
    notes: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  
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
    searchSection: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '35px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)'
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    searchInputContainer: {
      position: 'relative',
      flexGrow: '1'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280',
      fontSize: '16px'
    },
    searchInput: {
      width: '100%',
      padding: '14px 14px 14px 40px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
    },
    categoryLabel: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#475569',
      marginRight: '12px'
    },
    categoriesContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    category: {
      padding: '10px 18px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeCategory: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)'
    },
    inactiveCategory: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      '&:hover': {
        backgroundColor: '#e2e8f0'
      }
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
      }
    },
    cardHeader: {
      backgroundColor: '#f8fafc',
      padding: '25px',
      borderBottom: '1px solid #e2e8f0'
    },
    cardTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e40af',
      margin: '0 0 8px 0'
    },
    cardDescription: {
      fontSize: '15px',
      color: '#64748b',
      margin: '0'
    },
    cardBody: {
      padding: '25px'
    },
    placesTag: {
      display: 'inline-block',
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
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
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '20px'
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
      boxShadow: '0 2px 5px rgba(37, 99, 235, 0.3)',
      '&:hover': {
        backgroundColor: '#1d4ed8',
        boxShadow: '0 4px 8px rgba(37, 99, 235, 0.4)'
      }
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '35px',
      marginBottom: '35px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)'
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
    noResults: {
      textAlign: 'center',
      padding: '50px',
      color: '#64748b',
      fontSize: '17px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      marginBottom: '35px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)'
    },
    noResultsIcon: {
      fontSize: '50px',
      marginBottom: '15px',
      color: '#94a3b8'
    },
    noResultsText: {
      margin: '0',
      fontWeight: '500'
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
  
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  // Types de congés avec des icônes
  const congeTypes = [
    {
      type: 'congé payé',
      title: 'Congé Payé Standard',
      description: 'Congé annuel rémunéré',
      remainingDays: 15,
      category: 'Payés',
      icon: '🏖️'
    },
    {
      type: 'congé sans solde',
      title: 'Congé Sans Solde',
      description: 'Absence autorisée non rémunérée',
      remainingDays: 'Illimité',
      category: 'Sans solde',
      icon: '📅'
    },
    {
      type: 'congé maladie',
      title: 'Congé Maladie',
      description: 'Absence pour raison médicale',
      remainingDays: 10,
      category: 'Maladie',
      icon: '🏥'
    }
  ];

  // Filter congé types based on active category and search term
  const filteredCongeTypes = congeTypes.filter(conge => {
    // Filter by category
    const categoryMatch = activeCategory === 'Tous' || conge.category === activeCategory;
    
    // Filter by search term
    const searchMatch = conge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        conge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        conge.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
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
                    {congeTypes.find(c => c.type === formData.type)?.icon || ''} {formData.type}
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
                <div style={styles.colSpan2}>
                  <p style={styles.summaryLabel}>Motif</p>
                  <p style={styles.summaryValue}>{formData.reason}</p>
                </div>
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
          <>
            <div style={styles.searchSection}>
              <div style={styles.searchContainer}>
                <div style={styles.searchInputContainer}>
                  <span style={styles.searchIcon}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Rechercher un type de congé..." 
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                  <span style={styles.categoryLabel}>Catégorie:</span>
                  <div style={styles.categoriesContainer}>
                    {['Tous', 'Payés', 'Sans solde', 'Maladie'].map(cat => (
                      <span 
                        key={cat}
                        style={{
                          ...styles.category, 
                          ...(activeCategory === cat ? styles.activeCategory : styles.inactiveCategory)
                        }}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {filteredCongeTypes.length > 0 ? (
              <div style={styles.cardsContainer}>
                {filteredCongeTypes.map((conge, index) => (
                  <div style={styles.card} key={index}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>
                        {conge.icon} {conge.title}
                      </h3>
                      <p style={styles.cardDescription}>{conge.description}</p>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.placesTag}>
                        {typeof conge.remainingDays === 'number' 
                          ? `${conge.remainingDays} jours disponibles` 
                          : conge.remainingDays}
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (formData.type !== conge.type) {
                          setFormData(prev => ({ ...prev, type: conge.type }));
                        }
                        setSubmitted(true);
                      }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label} htmlFor={`reason-${index}`}>
                            Motif
                          </label>
                          <input
                            type="text"
                            id={`reason-${index}`}
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Précisez le motif de votre demande"
                            required
                          />
                        </div>
                        
                        <div style={styles.formGrid}>
                          <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor={`startDate-${index}`}>
                              Date de début
                            </label>
                            <input
                              type="date"
                              id={`startDate-${index}`}
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              style={styles.input}
                              required
                            />
                          </div>
                          
                          <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor={`endDate-${index}`}>
                              Date de fin
                            </label>
                            <input
                              type="date"
                              id={`endDate-${index}`}
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
                        
                        <div style={styles.buttonContainer}>
                          <button type="submit" style={styles.button}>
                            Demander ce congé
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔎</div>
                <p style={styles.noResultsText}>
                  Aucun type de congé ne correspond à votre recherche.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardDemandeConge;