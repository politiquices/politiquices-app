import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import Grafo from './components/Grafo';
import Partidos from './components/Partidos';
import Personalidades from './components/Personalidades';
import Sobre from './components/Sobre';
import ResponsiveAppBar from './components/NavigationBar'

function App() {
    return (
      <div>
          <ResponsiveAppBar/>
          <Routes>
              
              <Route path="/" element={<Home />} />
              <Route path="/Grafo" element={<Grafo />} />
              <Route path="/Personalidades" element={<Personalidades />} />
              <Route path="/Partidos" element={<Partidos />} />
              <Route path="/Sobre" element={<Sobre />} />
          </Routes>
      </div>
    );
  }
  
export default App;