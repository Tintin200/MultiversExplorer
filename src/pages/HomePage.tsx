import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

const HomePage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setCharacters(data.results.slice(0, 12)); // Récupérer les 12 premiers personnages
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleCardClick = (characterId: number) => {
    console.log(`Cliquer sur le personnage ${characterId}`);
    // Ici vous pouvez naviguer vers une page détaillée
    // navigate(`/character/${characterId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des personnages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        <h4 className="alert-heading">Erreur !</h4>
        <p>{error}</p>
        <button
          className="btn btn-outline-danger"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Les personnages de Rick et Morty</h1>
      <div className="row">
        {characters.map((character) => (
          <div key={character.id} className="col-md-4 mb-4">
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={character.image} />
              <Card.Body>
                <Card.Title>{character.name}</Card.Title>
                <Card.Text>
                  <strong>Espèce:</strong> {character.species}<br />
                </Card.Text>
                <Button variant="primary" onClick={() => handleCardClick(character.id)}>
                  Plus de détails
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
