import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import ProductNew from './pages/ProductNew.jsx';
import ProductEdit from './pages/ProductEdit.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/new" element={<ProductNew />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/products/:id/edit" element={<ProductEdit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}