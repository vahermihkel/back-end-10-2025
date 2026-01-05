import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

function SingleProduct() {
  const {id} = useParams();
  const [product, setProduct] = useState({
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
    });

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/products/" + id)
      .then(res => res.json())
      .then(json => setProduct(json))
  }, [id]);

  return (
    <div>
      <div>{product.id}</div>
      <div>{product.name}</div>
      <div>{product.category?.name}</div>
      <div>{product.price}€</div>
      <div>{product.description}</div>
      <div>{product.active ? "Aktiivne" : "Mitteaktiivne"}</div>
    </div>
  )
}

export default SingleProduct