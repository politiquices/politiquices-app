import React from 'react'
// import './App.css';
import { Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './components/utils/NavigationBar'
import Home from './components/Home'
import Cronologia from './components/Cronologia';
import Grafo from './components/Grafo';
// import Partidos from './components/Partidos';
import ListPersonalidades from './components/ListPersonalidades';
import FetchPersonalidade from './components/PersonalidadeInfo';
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
              <Route path="/personalidades" element={<ListPersonalidades />} />              
              <Route path="/estatistica" element={<Estatistica/>} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/personalidade/:id" element={<FetchPersonalidade />}
        />
          </Routes>
      </React.Fragment>
    );
  }



export default App;