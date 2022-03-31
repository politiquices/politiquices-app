import React, { useEffect, useState, Component} from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './components/NavigationBar'
import Home from './components/Home'
import Cronologia from './components/Cronologia';
import Grafo from './components/Grafo';
import Partidos from './components/Partidos';
import Personalidades from './components/Personalidades';
import Sobre from './components/Sobre';

function App() {
    return (
      <React.Fragment>
        <ResponsiveAppBar/>
          <Routes>                            
              <Route path="/" element={<Home />} />
              <Route path="/Cronologia" element={<Cronologia />} />
              <Route path="/Grafo" element={<Grafo />} />
              <Route path="/Personalidades" element={<Personalidades />} />
              <Route path="/Partidos" element={<Partidos />} />
              <Route path="/Sobre" element={<Sobre />} />
          </Routes>
      </React.Fragment>
    );
  }



export default App;