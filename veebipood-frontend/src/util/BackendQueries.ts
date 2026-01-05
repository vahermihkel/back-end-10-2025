/* eslint-disable @typescript-eslint/no-explicit-any */
export async function manageItem(
    endpoint: string, 
    body: any, 
    method: string, 
    message: string
  ) {
    const token = "Bearer " + sessionStorage.getItem("token");
    
    let items: any[] = [];
    await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.message && json.status && json.timestamp) {
          if (json.message.startsWith('could not execute statement')) {
            alert("Cannot delete when products use it");
          } else {
            alert(json.message);
          }
          return;
        }
        alert(message)
        items = json;
      })
    return items;
}