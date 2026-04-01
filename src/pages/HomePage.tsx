import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const charactersPerPage = 10;

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rickandmortyapi.com/api/character');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setAllCharacters(data.results);
        setTotalPages(Math.ceil(data.results.length / charactersPerPage));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [charactersPerPage]);
  useEffect(() => {
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    setCharacters(allCharacters.slice(startIndex, endIndex));
  }, [allCharacters, currentPage, charactersPerPage]);

  const handleCardClick = (characterId: number) => {
    navigate(`/character/${characterId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline-primary'}
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    return buttons;
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
                  <strong>Statut:</strong> {character.status}
                </Card.Text>
                <Button variant="primary" onClick={() => handleCardClick(character.id)}>
                  Plus de détails
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
          <Button
            variant="outline-primary"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="me-2"
          >
            Précédent
          </Button>

          {renderPaginationButtons()}

          <Button
            variant="outline-primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="ms-2"
          >
            Suivant
          </Button>
        </div>
      )}
      <div className="text-center text-muted mt-3">
        Page {currentPage} sur {totalPages} ({allCharacters.length} personnages au total)
      </div>
    </div>
  );
};

export default HomePage;
