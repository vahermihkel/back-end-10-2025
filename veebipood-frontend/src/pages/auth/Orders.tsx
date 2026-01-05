import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function Orders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const loadOrders = async() => {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/orders", {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
      });
      const json = await res.json();
      setOrders(json);
    }
    loadOrders();
  }, []);

  if (orders.length === 0) {
    return <div>Sa pole ühtegi tellimust teinud</div>
  }

  return (
     <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ordered date</th>
            <th>Sum</th>
            <th>Destination</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order =>
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.created}</td>
              <td>{order.total}</td>
              <td>{order.parcelMachineName}</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Orders