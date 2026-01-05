/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import type { Product } from "../models/Product";

function Cart() {
  const [cartProducts, setCartProducts] = useState<Product[]>(JSON.parse(localStorage.getItem("cart") || "[]"));
  const [parcelMachines, setParcelMachines] = useState<any[]>([]);
  const [dbParcelMachines, setDbParcelMachines] = useState<any[]>([]);
  // const [country, setCountry] = useState("EE");
  const [selectedParcelMachine, setSelectedParcelMachine] = useState("")

   useEffect(() => {
      const loadPMs = async() => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/parcelmachines");
        const json = await res.json();
        setParcelMachines(json.filter((pm: any) => pm.A0_NAME === "EE"));
        setDbParcelMachines(json);
      }
      loadPMs();
    }, []);

  function empty() {
    setCartProducts([]) // HTML-s teeb tühjaks
    localStorage.setItem("cart", "[]");
    localStorage.setItem("cart", JSON.stringify([]));
  }

  function removeFromCart(index: number) {
    cartProducts.splice(index,1);
    setCartProducts(cartProducts.slice());
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }

  function calculateCartSum() {
    let sum = 0;
    cartProducts.forEach(cartProduct => sum += cartProduct.price);
    return sum;
  }

  async function pay() {
    if (selectedParcelMachine === "") {
      alert("Pead valima pakiautomaadi!");
      return;
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/orders?parcelMachine=${selectedParcelMachine}`, {
      method: "POST",
      body: JSON.stringify(cartProducts),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    });
    const json = await res.json();
    if (json.paymentLink) {
      window.location.href = json.paymentLink;
      // empty();
    }
  }

  function updateCountry(country: string) {
    const result = dbParcelMachines.filter(pm => pm.A0_NAME === country);
    setParcelMachines(result);
    setSelectedParcelMachine("");
  }

  return (
    <div>
      {cartProducts.length > 0 &&
      <>
        <button onClick={empty}>Tühjenda</button>
        <div>Ostukorvis {cartProducts.length} eset</div>
      </>}
      {cartProducts.map((cartProduct, index) => 
        <div key={index}>
          <div>{cartProduct.name}</div>
          <div>{cartProduct.price}€</div>
          <button onClick={() => removeFromCart(index)}>x</button>
        </div>
      )}
      {cartProducts.length === 0 && <div>Ostukorv on tühi</div>}
      {cartProducts.length > 0 && 
        <div>
          <button onClick={() => updateCountry("EE")}>Eesti</button>
          <button onClick={() => updateCountry("LT")}>Läti</button>
          <button onClick={() => updateCountry("LV")}>Leedu</button>
          
          {selectedParcelMachine ?
          <div>{selectedParcelMachine}</div> :
          <select onChange={(e) => setSelectedParcelMachine(e.target.value)} defaultValue="">
            <option disabled value="">Vali pakiautomaat</option>
            {parcelMachines
              .map(pm => 
              <option key={pm.NAME}>
                {pm.NAME}
              </option>
            )}
          </select> }
          
          <br /><br />
          <div>{calculateCartSum()} €</div>
          <button onClick={pay}>Maksa</button>
        </div>}
    </div>
  )
}

export default Cart