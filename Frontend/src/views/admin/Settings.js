import React, { useState, useRef } from "react";

export default function ProfileForm() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "Marine",
    lastName: "Durand",
    email: "marine@example.com",
    phone: "06 12 34 56 78",
    password: "",
    confirmPassword: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
    
    // Password confirmation
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    // Password strength
    if (formData.password && formData.password.length < 8 && formData.password.length > 0) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (validateForm()) {
      // Simuler une requête API
      setTimeout(() => {
        setSuccessMessage("Profil mis à jour avec succès!");
        // Faire défiler vers le haut pour voir le message
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 800);
    } else {
      // Faire défiler jusqu'à la première erreur
      const firstErrorField = document.getElementById(Object.keys(errors)[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      <div className="form-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              {profileImage ? (
                <div className="avatar-wrapper">
                  <img src={profileImage} alt="Photo de profil" className="profile-image" />
                  <button type="button" className="change-avatar-btn" onClick={triggerFileInput}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="edit-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="avatar-wrapper">
                  <div className="avatar" onClick={triggerFileInput}>
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                  <button type="button" className="change-avatar-btn" onClick={triggerFileInput}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="edit-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden-file-input" 
              />
            </div>
            <h1 className="profile-title">Profil de {formData.firstName}</h1>
          </div>
          
          <div className="profile-body">
            {successMessage && (
              <div className="success-alert">
                <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="section-title">
                <span className="section-icon">👤</span>
                <h2>Informations personnelles</h2>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    Prénom <span className="required-star">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={errors.firstName ? "input-error" : ""}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">
                    Nom <span className="required-star">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={errors.lastName ? "input-error" : ""}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Adresse email <span className="required-star">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={errors.email ? "input-error" : ""}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={errors.phone ? "input-error" : ""}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: 06 12 34 56 78"
                  />
                  {errors.phone && <div className="error-text">{errors.phone}</div>}
                </div>
              </div>

              <div className="section-divider"></div>
              
              <div className="section-title">
                <span className="section-icon">🔒</span>
                <h2>Sécurité</h2>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">
                    Mot de passe
                  </label>
                  <div className="password-field">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={errors.password ? "input-error" : ""}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Laissez vide pour conserver l'actuel"
                    />
                    <button 
                      type="button" 
                      className="visibility-toggle" 
                      onClick={() => togglePasswordVisibility('password')}
                      aria-label={showPassword ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                    >
                      {showPassword ? (
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
                  {errors.password && <div className="error-text">{errors.password}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </label>
                  <div className="password-field">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={errors.confirmPassword ? "input-error" : ""}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmer le mot de passe"
                    />
                    <button 
                      type="button" 
                      className="visibility-toggle" 
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
                  {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
        /* Modern Variables */
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --primary-light: #dbeafe;
          --success: #10b981;
          --danger: #ef4444;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --radius-sm: 0.25rem;
          --radius: 0.5rem;
          --radius-md: 0.75rem;
          --radius-lg: 1rem;
          --radius-full: 9999px;
          --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Form Wrapper */
        .form-wrapper {
          font-family: var(--font-sans);
          color: var(--gray-800);
          line-height: 1.5;
          background-color: var(--gray-50);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        /* Profile Card */
        .profile-card {
          width: 100%;
          max-width: 800px;
          background-color: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Profile Header */
        .profile-header {
          background: linear-gradient(135deg, var(--primary), #60a5fa);
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: white;
          position: relative;
        }

        .avatar-container {
          position: relative;
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
        }

        .avatar {
          width: 6rem;
          height: 6rem;
          background-color: white;
          color: var(--primary);
          font-weight: 700;
          font-size: 2rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid rgba(255, 255, 255, 0.8);
          box-shadow: var(--shadow-md);
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .avatar:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-lg);
        }

        .profile-image {
          width: 6rem;
          height: 6rem;
          object-fit: cover;
          border-radius: var(--radius-full);
          border: 4px solid rgba(255, 255, 255, 0.8);
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
        }

        .profile-image:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-lg);
        }

        .change-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: white;
          border: none;
          width: 2rem;
          height: 2rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow);
          cursor: pointer;
          color: var(--primary);
          transition: all 0.2s ease;
        }

        .change-avatar-btn:hover {
          background-color: var(--primary-light);
          transform: scale(1.1);
        }

        .edit-icon {
          width: 1.2rem;
          height: 1.2rem;
        }

        .hidden-file-input {
          display: none;
        }

        .profile-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        /* Profile Body */
        .profile-body {
          padding: 2rem;
        }

        /* Success Alert */
        .success-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success);
          padding: 1rem 1.25rem;
          border-radius: var(--radius);
          margin-bottom: 2rem;
          border-left: 4px solid var(--success);
          animation: fadeIn 0.4s ease-out;
        }

        .success-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        /* Section Title */
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-icon {
          font-size: 1.25rem;
        }

        .section-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-800);
          margin: 0;
        }

        /* Form Layout */
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Form Group */
        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
        }

        .required-star {
          color: var(--danger);
          margin-left: 0.125rem;
        }

        /* Form Inputs */
        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          background-color: white;
          color: var(--gray-800);
          transition: all 0.2s ease;
        }

        .form-group input:hover {
          border-color: var(--gray-400);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .form-group input::placeholder {
          color: var(--gray-400);
        }

        .input-error {
          border-color: var(--danger) !important;
          background-color: rgba(239, 68, 68, 0.05) !important;
        }

        .input-error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
        }

        .error-text {
          color: var(--danger);
          font-size: 0.75rem;
          margin-top: 0.375rem;
          font-weight: 500;
        }

        /* Password Field */
        .password-field {
          position: relative;
        }

        .visibility-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }

        .visibility-toggle:hover {
          color: var(--primary);
        }

        .visibility-toggle svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Divider */
        .section-divider {
          height: 1px;
          background-color: var(--gray-200);
          margin: 2rem 0;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        .btn-cancel, .btn-save {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-cancel {
          background-color: white;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .btn-cancel:hover {
          background-color: var(--gray-50);
          border-color: var(--gray-400);
        }

        .btn-save {
          background-color: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
          gap: 0.5rem;
        }

        .btn-save:hover {
          background-color: var(--primary-hover);
          box-shadow: var(--shadow);
          transform: translateY(-1px);
        }

        .btn-icon {
          width: 1rem;
          height: 1rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-card {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}