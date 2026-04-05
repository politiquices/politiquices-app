import { Route, Routes } from 'react-router-dom'
import NavigationBar from './components/utils/NavigationBar'
import Footer from './components/utils/Footer'
import Versus from './components/Versus'
import Explorar from './components/Explorar'
import ListPersonalidades from './components/ListPersonalidadesLazy'
import ListPersonalidadesFiltered from './components/ListPersonalidadesFiltered'
import FetchPersonalidade from './components/PersonalidadeInfo'
import EntityVersusEntity from './components/EntityVersusEntity'
import Sobre from './components/Sobre'
import Pesquisa from './components/Pesquisa'
import Home from './components/Home'
import ErrorBoundary from './components/utils/ErrorBoundary'
import './App.css';

function App() {
  return (
    <>
      <NavigationBar />
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/versus" element={<Versus />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/relacoes" element={<Explorar />} />
        <Route path="/grafo" element={<Explorar />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/personalidades" element={<ListPersonalidades />} />
        <Route path="/sobre" element={<Sobre />} />        
        <Route path="/versus/:ent1/:relType/:ent2/:start/:end" element={<EntityVersusEntity />} />
        <Route path="/personalidade/:id" element={<FetchPersonalidade />} />
        <Route path="/education/:id" element={<ListPersonalidadesFiltered type="education" />} />
        <Route path="/occupation/:id" element={<ListPersonalidadesFiltered type="occupation" />} />
        <Route path="/public_office/:id" element={<ListPersonalidadesFiltered type="public_office" />} />
        <Route path="/government/:id" element={<ListPersonalidadesFiltered type="government" />} />
        <Route path="/assembly/:id" element={<ListPersonalidadesFiltered type="assembly" />} />
        <Route path="/party/:id" element={<ListPersonalidadesFiltered type="party" />} />
      </Routes>
      </ErrorBoundary>
      <Footer/>
    </>
  )
}

export default App
