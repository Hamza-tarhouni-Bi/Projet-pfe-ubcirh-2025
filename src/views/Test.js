import React, { useState } from "react";
import Navbar from "components/Navbars/IndexNavbar";

const Test = () => {
  // Données d'exemple pour les offres d'emploi
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

  // État pour les filtres et la recherche
  const [dateFilter, setDateFilter] = useState("N'importe quand");
  const [isDateExpanded, setIsDateExpanded] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fonction pour toggler la section de date
  const toggleDateSection = () => {
    setIsDateExpanded(!isDateExpanded);
  };

  // Reset filter function
  const resetFilters = () => {
    setDateFilter("N'importe quand");
    setSearchKeyword("");
    setFilteredJobs([]);
    setHasSearched(false);
  };

  // Fonction pour une recherche précise
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

  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault();

    let results = [...jobListings];
    

    // Filtrer par mot-clé avec correspondance exacte
    if (searchKeyword && searchKeyword.trim() !== "") {
      results = results.filter((job) => exactMatch(job.title, searchKeyword));
    }

    // Filtrage par date
    if (dateFilter === "Sous 30 jours") {
      const today = new Date(); // Date actuelle
      const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);

      results = results.filter((job) => {
        // Convertir la date du job en format correct
        const [day, month, year] = job.date.split("/");
        const jobDate = new Date(year, month - 1, day); // Mois est 0-indexé

        // Vérifier si la date du job est comprise entre il y a 30 jours et aujourd'hui
        return jobDate >= thirtyDaysAgo && jobDate <= today;
      });
    }

    setFilteredJobs(results);
    setHasSearched(true);
  };

  // Déterminer quelles offres afficher
  const displayedJobs = hasSearched ? filteredJobs : jobListings;

  return (
    <div className="careers-page">
      <Navbar />
      
      {/* Bannière avec barre de recherche */}
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

      {/* Contenu principal */}
      <div className="content-container">
        <div className="filters-container">
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
                    onChange={() => setDateFilter("Sous 30 jours")}
                  />
                  Sous 30 jours (1)
                </label>
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === "N'importe quand"}
                    onChange={() => setDateFilter("N'importe quand")}
                  />
                  N'importe quand (19)
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
                <h3 className="job-title">{job.title}</h3>
                <div className="job-details">
                  <p className="job-location">{job.location}</p>
                  <p className="job-date">{job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
        }
      `}</style>
    </div>
  );
};

export default Test;