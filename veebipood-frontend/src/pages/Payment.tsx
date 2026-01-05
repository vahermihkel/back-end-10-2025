import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Payment() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // saadame payment_reference backendi
    const orderReference = searchParams.get("order_reference");
    const paymentReference = searchParams.get("payment_reference");
    fetch(import.meta.env.VITE_BACKEND_URL + `/check-payment?orderReference=${orderReference}&paymentReference=${paymentReference}`, {
      method: "GET"
    })
    .then(res => res.json())
    .then(json => {
        if (json.message && json.status && json.timestamp) {
          alert(json.message);
          return;
        }
        if (json.paymentState === "SETTLED") {
          setMessage("Edukalt tasutud");
        } else {
          setMessage("Makse ei õnnestunud")
        }
    });
  }, [searchParams]);

  return (
    <div>
      {message}
    </div>
  )
}

export default Payment