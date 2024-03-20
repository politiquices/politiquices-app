import { Route, Routes } from 'react-router-dom'
import NavigationBar from './components/utils/NavigationBar'
import Footer from './components/utils/Footer'
import Home from './components/Home'
import Relacoes from './components/Relacoes'
import VisNetwork from './components/Grafo'
import ListPersonalidades from './components/ListPersonalidades'
import ListPersonalidadesFiltered from './components/ListPersonalidadesFiltered'
import FetchPersonalidade from './components/PersonalidadeInfo'
import EntityVersusEntity from './components/EntityVersusEntity'
import Estatistica from './components/Estatistica'
import Sobre from './components/Sobre'
// import Topicos from './components/Topicos'
import Pesquisa from './components/Pesquisa'
import './App.css';

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/relacoes" element={<Relacoes />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/grafo" element={<VisNetwork />} />
        <Route path="/personalidades" element={<ListPersonalidades />} />
        <Route path="/estatistica" element={<Estatistica />} />
        {/* <Route path="/topicos/:url" element={<Topicos />} /> */}
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/versus/:ent1/:relType/:ent2" element={<EntityVersusEntity />} />
        <Route path="/personalidade/:id" element={<FetchPersonalidade />} />
        <Route path="/education/:id" element={<ListPersonalidadesFiltered type="education" />} />
        <Route path="/occupation/:id" element={<ListPersonalidadesFiltered type="occupation" />} />
        <Route path="/public_office/:id" element={<ListPersonalidadesFiltered type="public_office" />} />
        <Route path="/government/:id" element={<ListPersonalidadesFiltered type="government" />} />
        <Route path="/assembly/:id" element={<ListPersonalidadesFiltered type="assembly" />} />
        <Route path="/party/:id" element={<ListPersonalidadesFiltered type="party" />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
