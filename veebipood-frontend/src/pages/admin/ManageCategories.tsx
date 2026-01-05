import { useEffect, useState } from "react";
import AdminHome from "./AdminHome";
import { Category } from "../../models/Category";
import useFetch from "../../hooks/useFetch";
import { manageItem } from "../../util/BackendQueries";

function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({
      "name": "",
      "active": true
  });
  const dbCategories = useFetch("/categories", []);

  useEffect(() => {
   setCategories(dbCategories);
  }, [dbCategories]);

  async function addCategory() {
    const categories = await manageItem("/categories", newCategory, 
                                    "POST", "Kategooria edukalt lisatud!");
    setCategories(categories);
  }

  async function deleteCategory(categoryId: number) {
    const categories = await manageItem("/categories?id=" + categoryId, null, 
                                    "DELETE", "Kategooria edukalt kustutatud!");
    if (categories.length > 0) {
      setCategories(categories);
    }
    // fetch(import.meta.env.VITE_BACKEND_URL + "/categories?id=" + categoryId, {
    //   method: "DELETE",
    //   headers: {
    //     "Authorization": "Bearer " + sessionStorage.getItem("token")
    //   }
    // })
    //   .then(res => res.json())
    //    .then(json => {
        // if (json.message && json.status && json.timestamp) {
        //   if (json.message.startsWith('could not execute statement [ERROR: update or delete on table "category" violates foreign key constraint')) {
        //     alert("Cannot delete when products use it");
        //   } else {
        //     alert(json.message);
        //   }
        //   return;
        // }
    //     alert("Kategooria edukalt kustutatud!");
    //     setCategories(json);
    //   })
  }

  return (
    <div>
      <AdminHome />
      <label>Name</label> <br />
      <input onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} type="text" /> <br />
      <label>Active</label> <br />
      <input defaultChecked={true} onChange={(e) => setNewCategory({...newCategory, active: e.target.checked})} type="checkbox" /> <br />
      <button onClick={addCategory}>Lisa</button>
      {categories.map(category => 
      <div key={category.id}>
        <div>{category.name}</div>
        <button onClick={() => deleteCategory(Number(category.id))}>x</button>
      </div>
     )}
    </div>
  )
}

export default ManageCategories