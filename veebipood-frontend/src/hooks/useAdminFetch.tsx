import { useEffect, useState } from "react";

function useAdminFetch(endpoint: string) {
  const [items, setItems] = useState([]);
  const [fetchMessage, setMessage] = useState("");

  useEffect(() => {
      fetch(import.meta.env.VITE_BACKEND_URL + endpoint,{
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token")
        }}
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            setMessage("You dont have enough rights to be here");
          }
        })
        .then(json => {
          if (json) {
            setItems(json);
          }
          console.log(json);  
        })
    }, [endpoint]);

  return (
    {items, fetchMessage}
  )
}

export default useAdminFetch