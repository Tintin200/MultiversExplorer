import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CharacterPage from '../pages/CharacterPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<CharacterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;