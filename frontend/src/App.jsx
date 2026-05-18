import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Gallery from './pages/Gallery'
import Register from './pages/Register'
import Eventregister from './pages/Eventregister'
import AdminDashboard from './pages/AdminDashboard'
import CommitteeDashboard from './pages/CommitteeDashboard'
import Login from './pages/Login'


// ── Route guards ──────────────────────────────────────────────────────────────
function CommitteeRoute({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (user?.role !== "committee") return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Committee dashboard — completely outside main Layout ── */}
      <Route path="/CommitteeDashboard" element={
        <CommitteeRoute>
          <CommitteeDashboard />
        </CommitteeRoute>
      } />

      {/* ── Admin dashboard — outside main Layout ── */}
      <Route path="/AdminDashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />

      {/* ── Main site with Navbar/Footer Layout ── */}
      <Route element={<Layout />}>
        <Route path="/"                    element={<Home />} />
        <Route path="/Events"              element={<Events />} />
        <Route path="/Calendar"            element={<Calendar />} />
        <Route path="/Contact"             element={<Contact />} />
        <Route path="/Gallery"             element={<Gallery />} />
        <Route path="/Register"            element={<Register />} />
        <Route path="/Login"               element={<Login />} />
        <Route path="/Eventregister/:id"   element={<Eventregister />} />
        <Route path="*"                    element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App