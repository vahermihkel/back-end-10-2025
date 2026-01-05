
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Cart from './pages/Cart';
import SingleProduct from './pages/SingleProduct';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ManageCategories from './pages/admin/ManageCategories';
import ManageProducts from './pages/admin/ManageProducts';
import AdminHome from './pages/admin/AdminHome';
import NavigationBar from './components/NavigationBar';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/auth/Profile';
import Persons from './pages/auth/Persons';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import NotFound from './pages/NotFound';
import Orders from './pages/auth/Orders';
import Payment from './pages/Payment';

function App() {
  const {loading, isLoggedIn, permissions} = useContext(AuthContext);

  if (loading) {
    return <div></div>
  }

  return (
    <>
      <NavigationBar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="cart" element={<Cart/>} />
        <Route path="product/:id" element={<SingleProduct/>} />
        <Route path="payment" element={<Payment/>} />

        {
        (permissions === "ADMIN" || permissions === "SUPERADMIN") ?
        <>
          <Route path="admin" element={<AdminHome/>} />
          <Route path="admin/add-product" element={<AddProduct/>} />
          <Route path="admin/edit-product/:id" element={<EditProduct/>} />
          <Route path="admin/manage-categories" element={<ManageCategories/>} />
          <Route path="admin/manage-products" element={<ManageProducts/>} />
        </> : 
        isLoggedIn === true ?
        <Route path="admin/*" element={<div>Forbidden</div>} /> :
        <Route path="admin/*" element={<Navigate to="/login" />} />
        }

        {
          isLoggedIn ?
          <>
            <Route path="profile" element={<Profile/>} />
            <Route path="orders" element={<Orders/>} />
          </> :
          <>
            <Route path="login" element={<Login/>} />
            <Route path="signup" element={<Signup/>} /> 
          </>
        }

        {permissions === "SUPERADMIN" && 
          <Route path="persons" element={<Persons/>} />}

        <Route path="*" element={<NotFound/>} />
      </Routes>

    </>
  )
}

export default App
