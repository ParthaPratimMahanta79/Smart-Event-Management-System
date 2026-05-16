import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'  
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Gallery from './pages/Gallery'
import Register from './pages/Register'
import Eventregister from './pages/Eventregister'

function App() {
  return (
    <AuthProvider>         
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
            <Route path="/Eventregister/:id" element={<Eventregister />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>          
  )
}

export default App