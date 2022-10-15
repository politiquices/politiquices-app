import React from 'react'
// import './App.css';
import { Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './components/utils/NavigationBar'
import Home from './components/Home'
import Relacoes from './components/Relacoes';
import Grafo from './components/Grafo';
// import Partidos from './components/Partidos';
import ListPersonalidades from './components/ListPersonalidades';
import FetchPersonalidade from './components/PersonalidadeInfo';
import FetchPersonalidadeHeadlines from './components/PersonalidadeHeadlines';
import Estatistica from './components/Estatistica';
import Sobre from './components/Sobre';

function App() {
    return (
      <React.Fragment>
        <ResponsiveAppBar/>
          <Routes>                            
              <Route path="/" element={<Home />} />
              <Route path="/relacoes" element={<Relacoes />} />
              <Route path="/grafo" element={<Grafo />} />
              <Route path="/personalidades" element={<ListPersonalidades />} />              
              <Route path="/estatistica" element={<Estatistica/>} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/personalidade/:id" element={<FetchPersonalidade/>} />
              <Route path="/personalidade_news/:id" element={<FetchPersonalidadeHeadlines/>} />
          </Routes>
      </React.Fragment>
    );
  }



export default App;