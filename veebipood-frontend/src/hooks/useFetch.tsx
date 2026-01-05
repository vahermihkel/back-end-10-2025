/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function useFetch(endpoint: string, initialValue: any) {
  const [items, setItems] = useState(initialValue);
  
  useEffect(() => {
      fetch(import.meta.env.VITE_BACKEND_URL + endpoint)
        .then(res => res.json())
        .then(json => setItems(json))
  }, [endpoint]);


  return (
    items
  )
}

export default useFetch