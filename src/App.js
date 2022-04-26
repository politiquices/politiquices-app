import React, { useEffect, useState, Component} from 'react'
import './App.css';
import { Route, Routes, useParams } from 'react-router-dom';
import ResponsiveAppBar from './components/NavigationBar'
import Home from './components/Home'
import Cronologia from './components/Cronologia';
import Grafo from './components/Grafo';
import Partidos from './components/Partidos';
import Personalidades from './components/Personalidades';
import PersonalidadeInfo from './components/Personalidade';
import Test from './components/Personalidade';
import Estatistica from './components/Estatistica';
import Sobre from './components/Sobre';

function App() {
    return (
      <React.Fragment>
        <ResponsiveAppBar/>
          <Routes>                            
              <Route path="/" element={<Home />} />
              <Route path="/cronologia" element={<Cronologia />} />
              <Route path="/grafo" element={<Grafo />} />
              <Route path="/personalidades" element={<Personalidades />} />
              <Route path="/partidos" element={<Partidos />} />
              <Route path="/estatistica" element={<Estatistica/>} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/personalidade/:id" element={<PersonalidadeInfo />}
        />
          </Routes>
      </React.Fragment>
    );
  }



export default App;