import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CharacterDetail {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
  origin: {
    name: string;
  };
}

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        setError('ID du personnage manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!response.ok) {
          throw new Error('Personnage non trouvé');
        }
        const data = await response.json();
        setCharacter(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des détails du personnage...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Erreur !</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={handleBackClick}>
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    );
  }

  if (!character) {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">Personnage non trouvé</h4>
          <Button variant="outline-warning" onClick={handleBackClick}>
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Img
              variant="top"
              src={character.image}
              alt={character.name}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Card.Title as="h2" className="mb-4">{character.name}</Card.Title>

              <Row className="mb-3">
                <Col sm={6}>
                  <div>
                    <h5 className="mb-2">Statut</h5>
                    <p className="mb-0 fw-bold">{character.status}</p>
                  </div>
                </Col>
                <Col sm={6}>
                  <div>
                    <h5 className="mb-2">Espèce</h5>
                    <p className="mb-0 fw-bold">{character.species}</p>
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <h5 className="mb-2">Origine</h5>
                <p className="mb-0 fw-bold">{character.origin.name}</p>
              </div>

              <Button variant="primary" size="lg" onClick={handleBackClick}>
                Retour à la liste
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default CharacterPage
