import React, { useState } from 'react';

const CardRecrutement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', location: '', date: '' });
  const [offers, setOffers] = useState([
    { title: 'Chef de Produit Marketing Junior', location: 'Tunisie', date: '2023-05-06' }
  ]);

  const handleAddOffer = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer({ ...newOffer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOffer.title && newOffer.location && newOffer.date) {
      setOffers([...offers, newOffer]);
      setNewOffer({ title: '', location: '', date: '' });
      setIsModalOpen(false);
    } else {
      alert("Veuillez remplir tous les champs !");
    }
  };

  const styles = {
    homeContainer: {
      fontFamily: 'Arial, sans-serif',
      paddingTop: '7rem',  
      
   
    },
    heading: {
      color: '#333',
      textAlign: 'center',
    },
    jobListing: {
      backgroundColor: '#f9f9f9',
      borderLeft: '5px solid #007bff',
      margin: '10px 0',  
      padding: '10px',  
      borderRadius: '5px',
    },
    jobTitle: {
      color: '#007bff',
      marginTop: '0',
    },
    jobDetail: {
      color: '#666',
      lineHeight: '1.6',
    },
    addButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '8px 16px', 
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '15px', 
    },
    modalOverlay: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      width: '300px',
    },
    modalInput: {
      width: '100%',
      padding: '8px', 
      margin: '8px 0', 
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    modalButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '8px 16px', 
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '10px',
    },
  };

  return (
    <div style={styles.homeContainer}>
      <button style={styles.addButton} onClick={handleAddOffer}>Ajouter une offre</button>

      {offers.map((offer, index) => (
        <div key={index} style={styles.jobListing}>
          <h2 style={styles.jobTitle}>{offer.title}</h2>
          <p style={styles.jobDetail}><strong>Lieu:</strong> {offer.location}</p>
          <p style={styles.jobDetail}><strong>Date:</strong> {offer.date}</p>
        </div>
      ))}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Ajouter une nouvelle offre</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Titre de l'offre"
                style={styles.modalInput}
                value={newOffer.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Lieu"
                style={styles.modalInput}
                value={newOffer.location}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="date"
                style={styles.modalInput}
                value={newOffer.date}
                onChange={handleInputChange}
              />
              <button type="submit" style={styles.modalButton}>Ajouter</button>
              <button type="button" style={styles.modalButton} onClick={handleCloseModal}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardRecrutement;
