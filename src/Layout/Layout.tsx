import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { characterService } from '../api/characterService';
import { Character } from '../api/types';

const Layout = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    characterService.getAll().then((data) => {
      setCharacters(data);
    });
  }, []);

  return (
    <>
      {characters.map((char) => (
        <div>
          <img src={'https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/' + char.image.full} alt={char.name} />
        </div>
      ))}
      <Router>
        <Routes>
          <Route path='/' element={<div>Hello World</div>} />
        </Routes>
      </Router>
    </>
  );
};

export default Layout;
