import { useState } from "react";
import { Product } from "../../models/Product";
import AdminHome from "./AdminHome";
import { Category } from "../../models/Category";
import useFetch from "../../hooks/useFetch";
import { manageItem } from "../../util/BackendQueries";

function AddProduct() {
  const [newProduct, setNewProduct] = useState<Product>({
      "name": "",
      "price": 0,
      "description": "",
      "category": {
        "id": 1,
        "name": "",
        "active": true
      },
      "active": true
    });

  // const [categories, setCategories] = useState<Category[]>([]);

  // useEffect(() => {
  //   fetch(import.meta.env.VITE_BACKEND_URL + "/categories")
  //     .then(res => res.json())
  //     .then(json => setCategories(json))
  // }, []);

  const categories: Category[] = useFetch("/categories", []);

  function addProduct() {
    manageItem("/products", newProduct, "POST", "Toode edukalt lisatud!");
  }

  return (
    <div>
      <div>Ajutine väljakuvamine: {JSON.stringify(newProduct)}</div>
      <AdminHome />
      <label>Name</label> <br />
      <input onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} type="text" /> <br />
      <label>Description</label> <br />
      <input onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} type="text" /> <br />
      <label>Price</label> <br />
      <input onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} type="text" /> <br />
      <label>Category</label> <br />
      {/* <input  type="text" /> <br /> */}
      <select onChange={(e) => setNewProduct({...newProduct, category: {
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
      <input defaultChecked={true} onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})} type="checkbox" /> <br />
      <button onClick={addProduct}>Lisa</button>

    </div>
  )
}

export default AddProduct