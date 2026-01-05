import { useEffect, useState } from "react";
import { Product } from "../../models/Product";
import AdminHome from "./AdminHome";
import { Link } from "react-router-dom";
import useAdminFetch from "../../hooks/useAdminFetch";

function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const {items, fetchMessage} = useAdminFetch("/admin-products");

  useEffect(() => {
    setProducts(items);
    setMessage(fetchMessage);
  }, [items, fetchMessage]);

  function deleteProduct(productId: number) {
    fetch(import.meta.env.VITE_BACKEND_URL + "/products?id=" + productId, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(json => setProducts(json))
  }

  if (message) {
    return <div>{message}</div>
  }

  return (
    <div>
      <AdminHome />
      {products.map(product => 
      <div key={product.id}>
        <div>{product.name}</div>
        <div>{product.price}</div>
        <div>{product.category?.name}</div>
        <button onClick={() => deleteProduct(Number(product.id))}>x</button>
        <Link to={"/admin/edit-product/" + product.id}>
          <button>Edit</button>
        </Link>
      </div>
     )}
    </div>
  )
}

export default ManageProducts