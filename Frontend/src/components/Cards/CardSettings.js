import React, { useState, useEffect } from "react";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Récupérer les données utilisateur au chargement du composant
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
   
    if (userData) {
      // Mapper les données utilisateur aux champs du formulaire
      const initialData = {
        firstName: userData.prenom || "",
        lastName: userData.nom || "",
        email: userData.email || "",
        phone: userData.tel || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      };
      
      setFormData(initialData);
      // Conserver une copie des données initiales pour la fonction d'annulation
      setInitialFormData(initialData);
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    ["firstName", "lastName", "email"].forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "Ce champ est obligatoire";
      }
    });
    
    // Email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // Password validation
    if (formData.newPassword) {
      // Si un nouveau mot de passe est entré, le mot de passe actuel est obligatoire
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Le mot de passe actuel est requis pour changer le mot de passe";
      }
      
      // Vérifier la complexité du nouveau mot de passe
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Le nouveau mot de passe doit contenir au moins 8 caractères";
      }
      
      // Vérifier que la confirmation correspond
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Les mots de passe ne correspondent pas";
      }
    }
    
    // Si un mot de passe de confirmation est entré, le nouveau mot de passe est obligatoire
    if (formData.confirmNewPassword && !formData.newPassword) {
      newErrors.newPassword = "Veuillez entrer un nouveau mot de passe";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (validateForm()) {
      try {
        // Récupérer l'ID utilisateur du localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData?._id;
        
        if (!userId) {
          setErrors({ currentPassword: "Impossible de récupérer l'ID utilisateur" });
          return;
        }
        
        // Préparer les données à envoyer
        const updateData = {
          nom: formData.lastName,
          prenom: formData.firstName,
          email: formData.email,
          tel: formData.phone
        };
        
        // Ajouter le mot de passe seulement si l'utilisateur tente de le changer
        if (formData.newPassword && formData.currentPassword) {
          updateData.password = formData.newPassword;
          updateData.currentPassword = formData.currentPassword;
        }
        
        // Appel à l'API pour mettre à jour les données
        const response = await fetch(`/updatePersonnel/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token_ubcirh')}`
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          // Afficher l'erreur de mot de passe sous le champ spécifique plutôt qu'en haut
          if (errorData.error && errorData.error.includes("mot de passe")) {
            setErrors({ currentPassword: errorData.error || "Mot de passe incorrect" });
          } else {
            setErrors({ form: errorData.error || "Erreur lors de la mise à jour" });
          }
          return;
        }
        
        const updatedUserData = await response.json();
        
        // Mettre à jour les données utilisateur dans le localStorage
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          ...updatedUserData
        }));
        
        setSuccessMessage("Profil mis à jour avec succès!");
        
        // Réinitialiser les champs de mot de passe
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
        
        // Faire défiler vers le haut pour voir le message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        // Afficher l'erreur sous le champ de mot de passe actuel si elle concerne le mot de passe
        if (error.message && error.message.toLowerCase().includes("mot de passe")) {
          setErrors({ currentPassword: error.message || "Erreur avec le mot de passe" });
        } else {
          setErrors({ form: error.message || "Une erreur s'est produite lors de la mise à jour du profil" });
        }
      }
    } else {
      // Faire défiler jusqu'à la première erreur
      const firstErrorField = document.getElementById(Object.keys(errors)[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
    }
  };

  // Nouvelle fonction pour gérer le bouton Annuler
  const handleCancel = () => {
    // Restaurer les données initiales
    setFormData({
      ...initialFormData,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
    
    // Effacer les erreurs et messages
    setErrors({});
    setSuccessMessage("");
    
    // Revenir en haut du formulaire
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'currentPassword') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      <div className="ubci-form-container">
        <div className="ubci-profile-card">
          <div className="ubci-profile-body">
            {successMessage && (
              <div className="ubci-success-alert">
                <svg className="ubci-success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            {errors.form && (
              <div className="ubci-error-alert">
                <svg className="ubci-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.form}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="ubci-section-title">
                <div className="ubci-section-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2>Informations personnelles</h2>
              </div>
              
              <div className="ubci-form-row">
                <div className="ubci-form-group">
                  <label htmlFor="firstName">
                    Prénom <span className="ubci-required">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={errors.firstName ? "ubci-input-error" : ""}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <div className="ubci-error-text">{errors.firstName}</div>}
                </div>
                
                <div className="ubci-form-group">
                  <label htmlFor="lastName">
                    Nom <span className="ubci-required">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={errors.lastName ? "ubci-input-error" : ""}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <div className="ubci-error-text">{errors.lastName}</div>}
                </div>
              </div>

              <div className="ubci-form-row">
                <div className="ubci-form-group">
                  <label htmlFor="email">
                    Adresse email <span className="ubci-required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={errors.email ? "ubci-input-error" : ""}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="ubci-error-text">{errors.email}</div>}
                </div>
                
                <div className="ubci-form-group">
                  <label htmlFor="phone">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={errors.phone ? "ubci-input-error" : ""}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: 06 12 34 56 78"
                  />
                  {errors.phone && <div className="ubci-error-text">{errors.phone}</div>}
                </div>
              </div>

              <div className="ubci-divider"></div>
              
              <div className="ubci-section-title">
                <div className="ubci-section-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h2>Modifier votre mot de passe</h2>
              </div>
              
              <div className="ubci-form-row">
                <div className="ubci-form-group">
                  <label htmlFor="currentPassword">
                    Mot de passe actuel
                  </label>
                  <div className="ubci-password-field">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      className={errors.currentPassword ? "ubci-input-error" : ""}
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button 
                      type="button" 
                      className="ubci-visibility-toggle" 
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      aria-label={showCurrentPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    >
                      {showCurrentPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && <div className="ubci-error-text">{errors.currentPassword}</div>}
                </div>
                
                <div className="ubci-form-group">
                  <label htmlFor="newPassword">
                    Nouveau mot de passe
                  </label>
                  <div className="ubci-password-field">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className={errors.newPassword ? "ubci-input-error" : ""}
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button 
                      type="button" 
                      className="ubci-visibility-toggle" 
                      onClick={() => togglePasswordVisibility('newPassword')}
                      aria-label={showNewPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    >
                      {showNewPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <div className="ubci-error-text">{errors.newPassword}</div>}
                </div>
              </div>

              <div className="ubci-form-row">
                <div className="ubci-form-group">
                  <label htmlFor="confirmNewPassword">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="ubci-password-field">
                    <input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={errors.confirmNewPassword ? "ubci-input-error" : ""}
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button 
                      type="button" 
                      className="ubci-visibility-toggle" 
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      aria-label={showConfirmPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    >
                      {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmNewPassword && <div className="ubci-error-text">{errors.confirmNewPassword}</div>}
                </div>
              </div>

              <div className="ubci-actions">
                <button 
                  type="button" 
                  className="ubci-btn-cancel"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button type="submit" className="ubci-btn-save">
                  <svg className="ubci-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* UBCI Variables */
        :root {
          --ubci-primary: #38b2ac;
          --ubci-primary-dark: #2c7a7b;
          --ubci-primary-light: #4fd1c5;
          --ubci-primary-bg: #e6fffa;
          --ubci-success: #38a169;
          --ubci-danger: #e53e3e;
          --ubci-background: #f7fafc;
          --ubci-card-bg: #ffffff;
          --ubci-gray-50: #f7fafc;
          --ubci-gray-100: #edf2f7;
          --ubci-gray-200: #e2e8f0;
          --ubci-gray-300: #cbd5e0;
          --ubci-gray-400: #a0aec0;
          --ubci-gray-500: #718096;
          --ubci-gray-600: #4a5568;
          --ubci-gray-700: #2d3748;
          --ubci-gray-800: #1a202c;
          --ubci-gray-900: #171923;
          --ubci-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --ubci-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --ubci-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --ubci-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        /* Form Container */
        .ubci-form-container {
          font-family: var(--ubci-font);
          color: var(--ubci-gray-800);
          line-height: 1.5;
          
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1.rem;
        }

        /* Profile Card */
        .ubci-profile-card {
          width: 100%;
          max-width: 1000px; /* Augmenté de 800px à 1000px */
          background-color: var(--ubci-card-bg);
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid var(--ubci-gray-200);
          position: relative;
        }

        /* Profile Body */
        .ubci-profile-body {
          padding: 2.5rem; /* Augmenté de 2rem à 2.5rem */
        }

        /* Success Alert */
        .ubci-success-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: rgba(56, 161, 105, 0.1);
          color: var(--ubci-success);
          padding: 1rem 1.25rem;
          border-radius: 0.375rem;
          margin-bottom: 2rem;
          border-left: 4px solid var(--ubci-success);
          animation: ubciFadeIn 0.4s ease-out;
        }

        .ubci-success-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        /* Section Title */
        .ubci-section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .ubci-section-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--ubci-primary);
        }

        .ubci-section-icon svg {
          width: 100%;
          height: 100%;
        }

        .ubci-section-title h2 {
          font-size: 1.25rem; /* Augmenté de 1.125rem à 1.25rem */
          font-weight: 600;
          color: #2c7a7b;
          margin: 0;
        }

        /* Form Layout */
        .ubci-form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem; /* Augmenté de 1.5rem à 1.75rem */
          margin-bottom: 1.75rem; /* Augmenté de 1.5rem à 1.75rem */
        }

        @media (min-width: 640px) {
          .ubci-form-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Form Group */
        .ubci-form-group {
          margin-bottom: 1.25rem; /* Augmenté de 1rem à 1.25rem */
        }

        .ubci-form-group label {
          display: block;
          font-size: 0.925rem; /* Augmenté de 0.875rem à 0.925rem */
          font-weight: 500;
          color: var(--ubci-gray-700);
          margin-bottom: 0.5rem;
        }

        .ubci-required {
          color: var(--ubci-danger);
          margin-left: 0.125rem;
        }

        /* Form Inputs */
        .ubci-form-group input {
          width: 100%;
          padding: 0.75rem 1rem; /* Augmenté de 0.625rem 0.875rem à 0.75rem 1rem */
          font-size: 1rem; /* Augmenté de 0.95rem à 1rem */
          border: 1px solid var(--ubci-gray-300);
          border-radius: 0.375rem;
          background-color: white;
          color: var(--ubci-gray-800);
          transition: all 0.2s ease;
        }

        .ubci-form-group input:hover {
          border-color: var(--ubci-gray-400);
        }

        .ubci-form-group input:focus {
          outline: none;
          border-color: #38b2ac;
          box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.15);
        }

        .ubci-form-group input::placeholder {
          color: var(--ubci-gray-400);
        }

        .ubci-input-error {
          border-color: var(--ubci-danger) !important;
          background-color: rgba(229, 62, 62, 0.05) !important;
        }

        .ubci-input-error:focus {
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15) !important;
        }

        /* Message d'erreur amélioré */
        .ubci-error-text {
          color: var(--ubci-danger);
          font-size: 0.7rem; /* Taille réduite */
          margin-top: 0.25rem; /* Espacement réduit */
          font-weight: 400; /* Police moins épaisse */
          padding-left: 0.25rem; /* Légère indentation */
          display: flex;
          align-items: center;
          opacity: 0.9; /* Légèrement transparent */
          max-width: 90%; /* Limite la largeur */
          line-height: 1.2; /* Hauteur de ligne réduite */
          transition: all 0.2s ease;
        }

        /* Ajoutez cette icône avant le message d'erreur */
        .ubci-error-text::before {
          content: "";
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          background-color: var(--ubci-danger);
          border-radius: 50%;
          margin-right: 0.25rem;
          flex-shrink: 0;
        }

        /* Animation subtile pour les erreurs */
        @keyframes ubciErrorAppear {
          from { opacity: 0; transform: translateY(-3px); }
          to { opacity: 0.9; transform: translateY(0); }
        }

        .ubci-error-text {
          animation: ubciErrorAppear 0.3s ease-out;
        }

        /* Erreur globale du formulaire plus discrète */
        .ubci-error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(229, 62, 62, 0.1);
          color: var(--ubci-danger);
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          border-left: 3px solid var(--ubci-danger);
          font-size: 0.85rem;
          animation: ubciFadeIn 0.4s ease-out;
        }

        .ubci-error-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        /* Password Field */
        .ubci-password-field {
          position: relative;
        }


        .ubci-visibility-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--ubci-gray-500);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }

        .ubci-visibility-toggle:hover {
          color: #38b2ac;
        }

        .ubci-visibility-toggle svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Divider */
        .ubci-divider {
          height: 2px; /* Augmenté de 1px à 2px */
          background: #e2e8f0;
          margin: 2.5rem 0; /* Augmenté de 2rem à 2.5rem */
        }

        /* Form Actions */
        .ubci-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2.5rem; /* Augmenté de 2rem à 2.5rem */
        }

        .ubci-btn-cancel, .ubci-btn-save {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 0.925rem; /* Augmenté de 0.875rem à 0.925rem */
          padding: 0.75rem 1.5rem; /* Augmenté de 0.625rem 1.25rem à 0.75rem 1.5rem */
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .ubci-btn-cancel {
          background-color: white;
          color: var(--ubci-gray-700);
          border: 1px solid var(--ubci-gray-300);
        }

        .ubci-btn-cancel:hover {
          background-color: var(--ubci-gray-50);
          border-color: var(--ubci-gray-400);
        }

        .ubci-btn-save {
          background-color: #38b2ac;
          color: white;
          box-shadow: var(--ubci-shadow-sm);
          gap: 0.5rem;
        }

        .ubci-btn-save:hover {
          background-color: #2c7a7b;
          box-shadow: var(--ubci-shadow);
        }

        .ubci-btn-icon {
          width: 1rem;
          height: 1rem;
        }

        /* Animations */
        @keyframes ubciFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ubci-profile-card {
          animation: ubciFadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}