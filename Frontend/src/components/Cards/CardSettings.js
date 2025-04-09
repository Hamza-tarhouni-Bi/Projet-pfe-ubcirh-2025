import React from "react";

export default function CardSettings() {
  return (
    <>
      <div className="formulaire-conteneur">
        <div className="formulaire-entete">
          <div className="entete-flex">
            <h6 className="entete-titre">Mon compte</h6>
            
          </div>
        </div>
        <div className="formulaire-corps">
          <form>
            <h6 className="section-titre">
              Informations Utilisateur
            </h6> 
            <div className="grille-flex">
              <div className="col-moitie">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="username"
                  >
                    Nom d'utilisateur                                       
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="champ-saisie"
                    defaultValue="lucky.jesse"
                  />
                </div>
              </div>
              <div className="col-moitie">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="email"
                  >
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="champ-saisie"
                    defaultValue="jesse@example.com"
                  />
                </div>
              </div>
              <div className="col-moitie">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="firstname"
                  >
                    Prénom
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    className="champ-saisie"
                    defaultValue="Lucky"
                  />
                </div>
              </div>
              <div className="col-moitie">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="lastname"
                  >
                    Nom
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    className="champ-saisie"
                    defaultValue="Jesse"
                  />
                </div>
              </div>
            </div>

            <hr className="separateur" />

            <h6 className="section-titre">
              Informations de Contact
            </h6>
            <div className="grille-flex">
              <div className="col-pleine">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="address"
                  >
                    Adresse
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="champ-saisie"
                    defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  />
                </div>
              </div>
              <div className="col-tiers">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="city"
                  >
                    Ville
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="champ-saisie"
                    defaultValue="New York"
                  />
                </div>
              </div>
              <div className="col-tiers">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="country"
                  >
                    Pays
                  </label>
                  <input
                    id="country"
                    type="text"
                    className="champ-saisie"
                    defaultValue="France"
                  />
                </div>
              </div>
              <div className="col-tiers">
                <div className="champ-groupe">
                  <label
                    className="champ-etiquette"
                    htmlFor="postal-code"
                  >
                    Code Postal
                  </label>
                  <input
                    id="postal-code"
                    type="text"
                    className="champ-saisie"
                    defaultValue="75000"
                  />
                </div>
              </div>
            </div>

            <hr className="separateur" />
            
            <div className="actions-groupe">
              <button 
                type="button" 
                className="btn-annuler"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-confirmer"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        /* Conteneur principal */
        .formulaire-conteneur {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-radius: 0.5rem;
          background-color: #f7fafc;
          border: 0;
        }
        
        /* En-tête du formulaire */
        .formulaire-entete {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: white;
          margin-bottom: 0;
          padding: 1.5rem;
        }
        
        .entete-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }
        
        .entete-titre {
          color: #4a5568;
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        /* Corps du formulaire */
        .formulaire-corps {
          flex: 1 1 auto;
          padding: 1rem 1rem 2.5rem;
        }
        
        @media (min-width: 1024px) {
          .formulaire-corps {
            padding: 0 2.5rem 2.5rem;
          }
        }
        
        /* Titres de section */
        .section-titre {
          color: #a0aec0;
          font-size: 0.875rem;
          margin-top: 0.75rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        /* Grille et colonnes */
        .grille-flex {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -1rem;
        }
        
        .col-moitie, .col-pleine, .col-tiers {
          width: 100%;
          padding: 0 1rem;
        }
        
        @media (min-width: 1024px) {
          .col-moitie {
            width: 50%;
          }
          
          .col-tiers {
            width: 33.333333%;
          }
        }
        
        /* Groupes de champs */
        .champ-groupe {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
        }
        
        .champ-etiquette {
          display: block;
          text-transform: uppercase;
          color: #4a5568;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .champ-saisie {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          placeholder-color: #cbd5e0;
          color: #4a5568;
          background-color: white;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          width: 100%;
          outline: none;
          transition: all 0.15s ease-linear;
        }
        
        .champ-saisie:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }
        
        /* Séparateur */
        .separateur {
          margin-top: 1.5rem;
          border-bottom-width: 1px;
          border-color: #cbd5e0;
        }
        
        /* Boutons */
        .btn-principal {
          background-color: #4299e1;
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease-linear;
        }
        
        .btn-principal:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .btn-principal:active {
          background-color: #3182ce;
        }
        
        .actions-groupe {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
        
        .btn-annuler {
          background-color: #e53e3e;
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          outline: none;
          margin-right: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease-linear;
        }
        
        .btn-annuler:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .btn-annuler:active {
          background-color: #c53030;
        }
        
        .btn-confirmer {
          background-color: #48bb78;
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease-linear;
        }
        
        .btn-confirmer:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .btn-confirmer:active {
          background-color: #38a169;
        }
      `}</style>
    </>
  );
}