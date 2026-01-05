import { useEffect, useState } from "react"
import { Person } from "../../models/Person";
import { Table } from 'react-bootstrap';

function Persons() {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const loadPersons = async() => {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/persons", {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
      });
      const json = await res.json();
      setPersons(json);
    }
    loadPersons();
  }, []);

  const changeAdmin = async(personId: number, role: string) => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/change-admin?personId=${personId}&isAdmin=${
      role === "CUSTOMER" ? true : false
    }`, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    });
    const json = await res.json();
    setPersons(json);
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change role</th>
          </tr>
        </thead>
        <tbody>
          {persons.map(person =>
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.email}</td>
              <td>{person.role}</td>
              <td>
                <button onClick={() => changeAdmin(Number(person.id), person.role)} disabled={person.role === "SUPERADMIN"}>
                  {person.role === "CUSTOMER" && "To Admin" }
                  {person.role === "ADMIN" && "Take away admin" }
                  {person.role === "SUPERADMIN" && "N/A" }
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Persons