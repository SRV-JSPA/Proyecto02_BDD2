import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import RestaurantesPage from './pages/Restaurantes/RestaurantesPage';
import RestauranteDetailPage from './pages/Restaurantes/RestauranteDetailPage';
import RestauranteFormPage from './pages/Restaurantes/RestauranteFormPage';

import MenuPage from './pages/Menu/MenuPage';
import ArticuloDetailPage from './pages/Menu/ArticuloDetailPage';
import ArticuloFormPage from './pages/Menu/ArticuloFormPage';

import ProfilePage from './pages/Usuario/ProfilePage';
import DireccionesPage from './pages/Usuario/DireccionesPage';
import MetodosPagoPage from './pages/Usuario/MetodosPagoPage';

import OrdenesPage from './pages/Ordenes/OrdenesPage';
import OrdenDetailPage from './pages/Ordenes/OrdenDetailPage';
import CheckoutPage from './pages/Ordenes/CheckoutPage';

import ResenasPage from './pages/Resenas/ResenasPage';
import ResenaFormPage from './pages/Resenas/ResenaFormPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurantes" element={<RestaurantesPage />} />
          <Route path="/restaurantes/:id" element={<RestauranteDetailPage />} />
          <Route path="/menu/:restauranteId" element={<MenuPage />} />
          <Route path="/menu/articulo/:id" element={<ArticuloDetailPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/restaurantes/nuevo" 
            element={
              <ProtectedRoute>
                <RestauranteFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/restaurantes/editar/:id" 
            element={
              <ProtectedRoute>
                <RestauranteFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/menu/nuevo/:restauranteId" 
            element={
              <ProtectedRoute>
                <ArticuloFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/menu/editar/:id" 
            element={
              <ProtectedRoute>
                <ArticuloFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/direcciones" 
            element={
              <ProtectedRoute>
                <DireccionesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/metodos-pago" 
            element={
              <ProtectedRoute>
                <MetodosPagoPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/ordenes" 
            element={
              <ProtectedRoute>
                <OrdenesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/ordenes/:id" 
            element={
              <ProtectedRoute>
                <OrdenDetailPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/resenas" 
            element={
              <ProtectedRoute>
                <ResenasPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/resenas/nuevo/:restauranteId" 
            element={
              <ProtectedRoute>
                <ResenaFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/resenas/editar/:id" 
            element={
              <ProtectedRoute>
                <ResenaFormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;