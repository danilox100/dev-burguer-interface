import { Route, Routes } from 'react-router-dom';

import {
  Cart,
  Checkout,
  CompletePayment,
  Home,
  Login,
  Menu,
  NewProduct,
  Orders,
  Register,
  Products,
} from '../containers';

import { UserLayout } from '../layouts/UserLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { EditProduct } from '../containers/Admin/EditProduct';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cardapio" element={<Menu />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/complete" element={<CompletePayment />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/pedidos" element={<Orders />} />
        <Route path="/admin/novo-produto" element={<NewProduct />} />
        <Route path="/admin/editar-produto" element={<EditProduct />} />
        <Route path="/admin/produtos" element={<Products />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
    </Routes>
  );
}
