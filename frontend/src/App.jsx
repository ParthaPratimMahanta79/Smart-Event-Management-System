import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Gallery from './pages/Gallery'
import Register from './pages/Register'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Gallery" element={<Gallery />} /> 
          <Route path="/Register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App