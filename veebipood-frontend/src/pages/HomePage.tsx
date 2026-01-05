import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const productsPerPage = 2;
  const [totalPages, setTotalPages] = useState(0); 
  const [sort, setSort] = useState("id,asc");
  const { t } = useTranslation();
  
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + `/public-products?page=${page}&size=${productsPerPage}&sort=${sort}`)
      .then(res => res.json())
      .then(json => {
        setProducts(json.content);
        setTotalPages(json.totalPages);
      })
  }, [page, sort]);

  function addToCart(addedProduct: Product) {
    const cartLS = JSON.parse(localStorage.getItem("cart") || "[]");
    cartLS.push(addedProduct);
    localStorage.setItem("cart", JSON.stringify(cartLS));
  }

  return (
    <div>
      <button onClick={() => setSort("id,asc")}>{t("sort.id-asc")}</button>
      <button onClick={() => setSort("id,desc")}>{t("sort.id-desc")}</button>
      <button onClick={() => setSort("name,asc")}>{t("sort.name-asc")}</button>
      <button onClick={() => setSort("name,desc")}>{t("sort.name-desc")}</button>
      <button onClick={() => setSort("price,asc")}>{t("sort.price-asc")}</button>
      <button onClick={() => setSort("price,desc")}>{t("sort.price-desc")}</button>

      {products.map(product => 
      <div key={product.id}>
        <div>Name: {product.name}</div>
        <div>Price: {product.price}</div>
        <button onClick={() => addToCart(product)}>Lisa ostukorvi</button>
        <Link to={"/product/" + product.id}>
          Vt lähemalt
        </Link>
      </div>
     )}
     <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
     <span>{page+1} / {totalPages}</span>
     <button disabled={page+1 === totalPages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  )
}

export default HomePage