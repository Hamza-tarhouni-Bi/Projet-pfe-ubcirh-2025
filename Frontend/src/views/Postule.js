import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/IndexNavbar";

const Postule = () => {
  // Existing state for job listings and search
  const [jobListings, setJobListings] = useState([
    {
      id: 1,
      title: "Chef de Produit Marketing Junior",
      location: "Tunisie",
      date: "05/03/2025",
    },
    {
      id: 2,
      title: "IT Business Analyst (AMOA)",
      location: "Tunisie",
      date: "17/02/2025",
    },
    {
      id: 3,
      title: "Chef de Produit Marketing Junior",
      location: "Tunisie",
      date: "05/03/2022",
    },
  ]);

  // New state for modal and selected job
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [fileName, setFileName] = useState("Aucun fichier sélectionné");
  const [fileError, setFileError] = useState(""); // New state to track file upload errors

  // Existing search and filter states and functions...
  const [dateFilter, setDateFilter] = useState("N'importe quand");
  const [isDateExpanded, setIsDateExpanded] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Existing functions from previous implementation...
  const toggleDateSection = () => {
    setIsDateExpanded(!isDateExpanded);
  };

  const resetFilters = () => {
    setDateFilter("N'importe quand");
    setSearchKeyword("");
    setFilteredJobs([]);
    setHasSearched(false);
  };

  const exactMatch = (text, query) => {
    if (!query || query.trim() === "") return true;

    const formattedText = text.toLowerCase();
    const formattedQuery = query.toLowerCase().trim();

    const queryWords = formattedQuery.split(/\s+/);

    return queryWords.every((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(formattedText);
    });
  };

  // Apply filters function (separate from handleSearch)
  const applyFilters = () => {
    let results = [...jobListings];
    
    if (searchKeyword && searchKeyword.trim() !== "") {
      results = results.filter((job) => exactMatch(job.title, searchKeyword));
    }

    if (dateFilter === "Sous 30 jours") {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);

      results = results.filter((job) => {
        const [day, month, year] = job.date.split("/");
        const jobDate = new Date(year, month - 1, day);

        return jobDate >= thirtyDaysAgo && jobDate <= today;
      });
    }

    setFilteredJobs(results);
    setHasSearched(true);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Handle date filter change
  const handleDateFilterChange = (newDateFilter) => {
    setDateFilter(newDateFilter);
    // This will trigger the useEffect to apply filters
  };

  // UseEffect to apply filters whenever dateFilter changes
  useEffect(() => {
    applyFilters();
  }, [dateFilter]); // This will run applyFilters whenever dateFilter changes

  // New functions for modal
  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setFileError(""); // Reset file error when opening modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setFileName("Aucun fichier sélectionné");
    setFileError(""); // Reset file error when closing modal
  };

  // Handle file upload with PDF validation
  const handleFileChange = (e) => {
    setFileError(""); // Reset error message
    
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Check if all files are PDFs
      const nonPdfFiles = files.filter(file => file.type !== 'application/pdf');
      
      if (nonPdfFiles.length > 0) {
        setFileError("Erreur: Veuillez ne sélectionner que des fichiers PDF.");
        e.target.value = ''; // Clear the file input
        setFileName("Aucun fichier sélectionné");
        return;
      }
      
      const fileNames = files.map(file => file.name).join(", ");
      setFileName(fileNames);
    } else {
      setFileName("Aucun fichier sélectionné");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add your form submission logic here
    // For example, you could check if all required fields are filled
    
    if (fileName === "Aucun fichier sélectionné") {
      setFileError("Erreur: Veuillez télécharger votre CV et lettre de motivation.");
      return;
    }
    
    // If validation passes, you would typically submit the form data
    alert("Candidature soumise avec succès!");
    closeModal();
  };

  // Trigger the file input when clicking on the upload area
  const triggerFileInput = () => {
    document.getElementById("file-upload-input").click();
  };

  const displayedJobs = hasSearched ? filteredJobs : jobListings;

  // Count jobs that are within 30 days
  const countJobsWithin30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);

    return jobListings.filter((job) => {
      const [day, month, year] = job.date.split("/");
      const jobDate = new Date(year, month - 1, day);
      return jobDate >= thirtyDaysAgo && jobDate <= today;
    }).length;
  };

  const jobsWithin30DaysCount = countJobsWithin30Days();

  return (
    <div className="careers-page">
      <Navbar />
      
      {/* Existing banner and search code */}
      <div className="banner">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Saisissez un titre de poste ou un mot-clé"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <button type="submit" className="search-button">
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-container">
          {/* Existing filters code */}
          <div className="filters-header">
            <h2>Filtres</h2>
            <button className="reset-button" onClick={resetFilters}>
              Réinitialiser
            </button>
          </div>

          <div className="filter-section">
            <div className="filter-header" onClick={toggleDateSection}>
              <h3>Date de publication</h3>
              <span className={`arrow ${isDateExpanded ? "expanded" : ""}`}>
                ▼
              </span>
            </div>

            {isDateExpanded && (
              <div className="filter-options">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === "Sous 30 jours"}
                    onChange={() => handleDateFilterChange("Sous 30 jours")}
                  />
                  Sous 30 jours ({jobsWithin30DaysCount})
                </label>
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === "N'importe quand"}
                    onChange={() => handleDateFilterChange("N'importe quand")}
                  />
                  N'importe quand ({jobListings.length})
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="job-listings-container">
          <h1>Postes à pourvoir actuellement</h1>

          {hasSearched && (
            <div className="search-results-info">
              <p>
                {filteredJobs.length} offre(s) d'emploi trouvée(s){" "}
                {searchKeyword && `pour "${searchKeyword}"`}
                {dateFilter === "Sous 30 jours" && " des 30 derniers jours"}
              </p>
              {filteredJobs.length === 0 && (
                <p className="no-results">
                  Aucun résultat trouvé. Veuillez essayer d'autres critères de
                  recherche.
                </p>
              )}
            </div>
          )}

          <div className="job-cards">
            {displayedJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-content">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-details">
                    <p className="job-location">{job.location}</p>
                    <p className="job-date">{job.date}</p>
                  </div>
                </div>
                <button 
                  className="postuler-button"
                  onClick={() => openApplicationModal(job)}
                >
                  Postuler
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for job application with improved design and PDF-only validation */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-title">
              <h2>Candidature pour {selectedJob.title}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <label>Nom complet</label> 
                <div className="name-inputs">
                  <input type="text" placeholder="Prénom" required />
                  <input type="text" placeholder="Nom de famille" required />
                </div>
              </div>

              <div className="form-section">
                <label>Adresse actuelle</label>
                <input type="text" placeholder="Adresse" className="mb-3" required />
                
                <div className="address-details">
                  <input type="text" placeholder="Ville" required />
                  <input type="text" placeholder="Code postal" required />
                </div>
              </div>

              <div className="form-section">
                <label>Adresse E-mail</label>
                <input type="email" placeholder="Prénom@gmail.com" required />
              </div>

              <div className="form-section">
                <label>Numéro de téléphone</label>
                <div className="phone-input">
                  <select className="country-code" required>
                    <option value="+216">Tunisie (+216)</option>
                    <option value="+33">France (+33)</option>
                    <option value="+212">Maroc (+212)</option>
                    <option value="+213">Algérie (+213)</option>
                    <option value="+32">Belgique (+32)</option>
                    <option value="+1">Canada/USA (+1)</option>
                    <option value="+41">Suisse (+41)</option>
                    <option value="">Autre</option>
                  </select>
                  <input type="text" placeholder="Numéro de téléphone" required />
                </div>
              </div>

              <div className="form-section">
                <label>Déposez votre CV et lettre de motivation (format PDF uniquement)</label>
                <div className={`file-upload ${fileError ? "file-error" : ""}`} onClick={triggerFileInput}>
                  <input 
                    type="file" 
                    id="file-upload-input" 
                    multiple 
                    accept=".pdf,application/pdf" 
                    onChange={handleFileChange}
                  />
                  <div className="file-upload-content">
                    <span className="upload-icon">📁</span>
                    <span className="browse-text">Parcourir les fichiers PDF</span>
                    <p className="selected-files">{fileName}</p>
                    {fileError && <p className="error-message">{fileError}</p>}
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-application">
                Postuler
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }
        
        .careers-page {
          width: 100%;
          background-color: #f5f5f5;
          min-height: 100vh;
        }
        
        .banner {
          width: 100%;
          height: 380px;
          background-image: url('https://ubci.csod.com/clientimg/ubci/careersite/banner/Backgroundpicture_6372a143-698a-40dd-99a1-fcbf9c1d104e.jpg');
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .search-container {
          width: 100%;
          max-width: 800px;
          padding: 0 20px;
          z-index: 10;
        }
        
        .search-bar {
          display: flex;
          background: white;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .search-input-container {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 15px;
        }
        
        .search-icon {
          margin-right: 10px;
          color: #777;
        }
        
        .search-input {
          flex: 1;
          padding: 15px 0;
          border: none;
          font-size: 16px;
          outline: none;
        }
        
        .search-input:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
        
        .search-button {
          padding: 0 30px;
          background-color: #0052cc;
          color: white;
          border: none;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .search-button:hover {
          background-color: #003d99;
        }
        
        .content-container {
          display: flex;
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 20px;
        }
        
        .filters-container {
          width: 300px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 15px;
          margin-right: 20px;
          height: fit-content;
        }
        
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .filters-header h2 {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        
        .reset-button {
          color: #1a73e8;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .filter-section {
          margin-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 15px;
        }
        
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .filter-header h3 {
          font-size: 16px;
          font-weight: normal;
          color: #333;
        }
        
        .arrow {
          font-size: 12px;
          transition: transform 0.3s;
        }
        
        .arrow.expanded {
          transform: rotate(180deg);
        }
        
        .filter-options {
          margin-top: 10px;
        }
        
        .filter-radio {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: #555;
        }
        
        .filter-radio input {
          margin-right: 8px;
        }
        
        .job-listings-container {
          flex: 1;
        }
        
        .job-listings-container h1 {
          font-size: 22px;
          color: #333;
          margin-bottom: 20px;
          font-weight: normal;
        }
        
        .search-results-info {
          margin-bottom: 15px;
          font-size: 14px;
          color: #555;
        }
        
        .no-results {
          color: #d32f2f;
          margin-top: 5px;
        }
        
        .job-cards {
          display: flex;
          flex-direction: column;
        }
        
        .job-card {
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 15px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        
        .job-title {
          color: #1a73e8;
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: normal;
        }
        
        .job-details {
          display: flex;
          flex-direction: column;
        }
        
        .job-location, .job-date {
          font-size: 14px;
          color: #555;
          margin-bottom: 3px;
        }

        .postuler-button {
          background-color:#2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .postuler-button:hover {
          background-color: #2563eb;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }

        .modal-title {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          
        }

        .modal-title h2 {
          font-size: 22px;
          color: #1a73e8;
          font-weight: bold;
        }

        .form-section {
          margin-bottom: 25px;
        }

        .form-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          color: #333;
        }

        .form-section input,
        .form-section select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-section input:focus,
        .form-section select:focus {
          outline: none;
          border-color: #1a73e8;
          box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }

        .name-inputs,
        .address-details,
        .phone-input {
          display: flex;
          gap: 15px;
        }

        .name-inputs input,
        .address-details input,
        .phone-input input,
        .phone-input select {
          flex: 1;
        }

        .country-code {
          width: 40%;
          flex: 0.4;
        }

        .file-upload {
          border: 2px dashed #1a73e8;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          border-radius: 4px;
          background-color: #f5f9ff;
          transition: all 0.3s ease;
        }

        .file-upload:hover {
          background-color: #e8f1fe;
          border-color: #0d47a1;
        }

        .file-upload.file-error {
          border-color: #d32f2f;
          background-color: #fff5f5;
        }

        .file-upload input[type="file"] {
          display: none;
        }

        .file-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .upload-icon {
          font-size: 24px;
          color: #1a73e8;
        }

        .browse-text {
          color: #1a73e8;
          font-weight: bold;
          font-size: 16px;
        }

        .selected-files {
          font-size: 14px;
          color: #555;
          margin-top: 5px;
          word-break: break-word;
        }

        .error-message {
          color: #d32f2f;
          font-size: 14px;
          margin-top: 5px;
        }

        .submit-application {
          width: 100%;
          padding: 15px;
          background-color: #1a73e8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 16px;
          font-weight: bold;
        }

        .submit-application:hover {
          background-color: #0d47a1;
        }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }
          
          .search-button {
            padding: 15px 0;
          }
          
          .content-container {
            flex-direction: column;
          }
          
          .filters-container {
            width: 100%;
            margin-right: 0;
            margin-bottom: 20px;
          }
          
          .job-listings-container {
            width: 100%;
          }

          .name-inputs,
          .address-details,
          .phone-input {
            flex-direction: column;
            gap: 10px;
          }

          .modal-content {
            padding: 20px;
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Postule;