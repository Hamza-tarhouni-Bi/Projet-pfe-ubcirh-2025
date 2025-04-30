import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/fr';

const CalendrierJoursFeries = () => {
  const [currentDate, setCurrentDate] = useState(moment());

  // Configuration de la langue française
  moment.locale('fr');

  // Jours fériés en Tunisie (dates fixes pour 2025)
  const joursFeries = [
    { date: '2025-01-01', nom: "Jour de l'an" },
    { date: '2025-01-14', nom: "Fête de la Révolution et de la Jeunesse" },
    { date: '2025-03-20', nom: "Fête de l'Indépendance" },
    { date: '2025-04-09', nom: "Jour des Martyrs" },
    { date: '2025-05-01', nom: "Fête du Travail" },
    { date: '2025-07-25', nom: "Fête de la République" },
    { date: '2025-08-13', nom: "Fête de la Femme" },
    { date: '2025-10-15', nom: "Fête de l'Évacuation" }
  ];
  
  // Jours fériés à dates variables (basés sur calendriers lunaires)
  const joursFeriesVariables = [
    { date: '2025-04-10', nom: "Aïd El-Fitr", duree: 3 },
    { date: '2025-06-17', nom: "Aïd El-Idha", duree: 3 },
    { date: '2025-07-07', nom: "Nouvel An Hégire" },
    { date: '2025-09-16', nom: "Mouled" }
  ];

  // Fonction pour vérifier si une date est un jour férié
  const estJourFerie = (date) => {
    const dateFormatee = moment(date).format('YYYY-MM-DD');
    
    // Vérifier les jours fériés fixes
    const fixe = joursFeries.find(jour => jour.date === dateFormatee);
    if (fixe) return fixe.nom;
    
    // Vérifier les jours fériés variables
    for (const jour of joursFeriesVariables) {
      const dateDebut = moment(jour.date);
      const dateFin = moment(jour.date).add((jour.duree || 1) - 1, 'days');
      
      if (moment(date).isBetween(dateDebut, dateFin, null, '[]')) {
        return jour.nom;
      }
    }
    
    return null;
  };

  // Génération des jours du mois
  const genererJoursDuMois = () => {
    const debutMois = moment(currentDate).startOf('month');
    const finMois = moment(currentDate).endOf('month');
    const debutCalendrier = moment(debutMois).startOf('week');
    const finCalendrier = moment(finMois).endOf('week');
    
    const jours = [];
    let jour = moment(debutCalendrier);
    
    while (jour.isSameOrBefore(finCalendrier)) {
      jours.push(moment(jour));
      jour.add(1, 'day');
    }
    
    return jours;
  };

  // Changement de mois
  const moisPrecedent = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };
  
  const moisSuivant = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  return (
    <div className="calendrier-container">
      <div className="calendrier-header">
        <h2>Calendrier des Jours Fériés</h2>
        <div className="navigation-mois">
          <button className="btn-navigation" onClick={moisPrecedent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          <h3>{currentDate.format('MMMM YYYY')}</h3>
          <button className="btn-navigation" onClick={moisSuivant}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="jours-semaine">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
          <div key={jour} className="jour-semaine">{jour}</div>
        ))}
      </div>
      
      <div className="jours-mois">
        {genererJoursDuMois().map(jour => {
          const estMoisCourant = jour.month() === currentDate.month();
          const estAujourdhui = jour.isSame(moment(), 'day');
          const jourFerie = estJourFerie(jour);
          
          return (
            <div 
              key={jour.format('YYYY-MM-DD')} 
              className={`jour-calendrier ${estMoisCourant ? 'mois-courant' : 'autre-mois'} 
                        ${estAujourdhui ? 'aujourdhui' : ''} 
                        ${jourFerie ? 'jour-ferie' : ''}`}
            >
              <div className="numero-jour">{jour.date()}</div>
              {jourFerie && (
                <div className="nom-ferie" title={jourFerie}>
                  {jourFerie.length > 12 ? `${jourFerie.substring(0, 12)}...` : jourFerie}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .calendrier-container {
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Roboto', 'Arial', sans-serif;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 16px;
        }
        
        .calendrier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .calendrier-header h2 {
          font-size: 20px;
          font-weight: 500;
          color: #333;
          margin: 0;
        }
        
        .navigation-mois {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .navigation-mois h3 {
          font-size: 16px;
          margin: 0;
          text-transform: capitalize;
          min-width: 120px;
          text-align: center;
        }
        
        .btn-navigation {
          background: #fff;
          color: #555;
          border: 1px solid #eaeaea;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
          
        .btn-navigation:hover {
          background-color: #f6f6f6;
          color: #333;
        }
        
        .jours-semaine {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 500;
          background-color: #f8f9fa;
          padding: 8px 0;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        
        .jour-semaine {
          font-size: 14px;
          color: #555;
        }
        
        .jours-mois {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-gap: 6px;
        }
        
        .jour-calendrier {
          aspect-ratio: 1;
          border-radius: 6px;
          border: 1px solid #eaeaea;
          padding: 6px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 70px;
        }
        
        .mois-courant {
          background-color: white;
        }
        
        .autre-mois {
          background-color: #f9f9f9;
          color: #bbb;
        }
        
        .aujourdhui {
          background-color: #e6f7ff;
          font-weight: bold;
          border: 2px solid #48aff0;
        }
        
        .jour-ferie {
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
        }
        
        .numero-jour {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .nom-ferie {
          font-size: 11px;
          padding: 2px 4px;
          background-color: #ff5252;
          color: white;
          border-radius: 4px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default CalendrierJoursFeries;