import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Category } from "../../models/Category";
import useFetch from "../../hooks/useFetch";
import { Product } from "../../models/Product";
import { manageItem } from "../../util/BackendQueries";

function EditProduct() {
  const {id} = useParams();
  const initialValue: Product = {
      "id": 0,
      "name": "",
      "price": 0,
      "description": "",
      "category": {
        "id": 1,
        "name": "",
        "active": true
      },
      "active": true
    }
  const [product, setProduct] = useState(initialValue);
  // const [categories, setCategories] = useState<Category[]>([]);

  const categories: Category[] = useFetch("/categories", []);

  // useEffect(() => {
  //   fetch(import.meta.env.VITE_BACKEND_URL + "/categories")
  //     .then(res => res.json())
  //     .then(json => setCategories(json))
  // }, []);
  const dbProduct: Product = useFetch("/products/" + id, initialValue);

  useEffect(() => {
      setProduct(dbProduct);
  }, [id, dbProduct]);

  // useEffect(() => {
  //   fetch(import.meta.env.VITE_BACKEND_URL + "/products/" + id)
  //     .then(res => res.json())
  //     .then(json => setProduct(json))
  // }, [id]);

  function updateProduct() {
      manageItem("/products",product, "PUT", "Toode edukalt muudetud!");
    }

  return (
    <div>
      <label>ID</label> <br />
      <input value={product.id} disabled type="text" /> <br />
      <label>Name</label> <br />
      <input 
        value={product.name} 
        onChange={(e) => setProduct({...product, name: e.target.value})} 
        type="text" /> <br />
      <label>Price</label> <br />
      <input 
        value={product.price}
        onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
        type="text" /> <br />
      <label>Descrption</label> <br />
      <input 
        value={product.description} 
        onChange={(e) => setProduct({...product, description: e.target.value})} 
        type="text" /> <br />
      <label>Category</label> <br />
      <select value={product.category?.id} onChange={(e) => setProduct({...product, category: {
        "id": Number(e.target.value),
        "name": "",
        "active": true
        }})}>
        {categories.map(category =>
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        )}
      </select>
      <label>Active</label> <br />
      <input defaultChecked={true} onChange={(e) => setProduct({...product, active: e.target.checked})} type="checkbox" /> <br />
      <button onClick={updateProduct}>Salvesta</button>
    </div>
  )
}

export default EditProduct