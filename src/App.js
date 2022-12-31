import { Route, Routes } from 'react-router-dom'
// import ResponsiveAppBar from './components/utils/NavigationBar'
import NewResponsiveAppBar from './components/utils/NewNavBar'
import Home from './components/Home'
import Relacoes from './components/Relacoes'
import Grafo from './components/Grafo'
import ListPersonalidades from './components/ListPersonalidades'
import ListPersonalidadesFiltered from './components/ListPersonalidadesFiltered'
import FetchPersonalidade from './components/PersonalidadeInfo'
import FetchPersonalidadeHeadlines from './components/PersonalidadeHeadlines'
import Estatistica from './components/Estatistica'
import Sobre from './components/Sobre'
import Topicos from './components/Topicos'

function App() {
  return (
    <>
      <NewResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/relacoes" element={<Relacoes />} />
        <Route path="/grafo" element={<Grafo />} />
        <Route path="/personalidades" element={<ListPersonalidades />} />
        <Route path="/estatistica" element={<Estatistica />} />
        <Route path="/topicos" element={<Topicos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/personalidade/:id" element={<FetchPersonalidade />} />
        <Route path="/personalidade_news/:id" element={<FetchPersonalidadeHeadlines />} />
        <Route path="/education/:id" element={<ListPersonalidadesFiltered type="education" />} />
        <Route path="/occupation/:id" element={<ListPersonalidadesFiltered type="occupation" />} />
        <Route path="/public_office/:id" element={<ListPersonalidadesFiltered type="public_office" />} />
        <Route path="/government/:id" element={<ListPersonalidadesFiltered type="government" />} />
        <Route path="/assembly/:id" element={<ListPersonalidadesFiltered type="assembly" />} />
        <Route path="/party/:id" element={<ListPersonalidadesFiltered type="party" />} />
      </Routes>
    </>
  )
}

export default App
