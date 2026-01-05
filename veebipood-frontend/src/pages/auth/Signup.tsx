import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Person } from "../../models/Person";

function Signup() {
  const [person, setPerson] = useState<Person>({firstName: "", lastName: "", email: "", password: "", role: ""});
  const navigate = useNavigate();

  // Reacti hook:
  // 1. Ei tohi olla tingimuslikult loodud
  // 2. Ei tohi olla funktsioonis loodud
  // 3. Peab algama use- eesliidesega
  // 4. Peab olema imporditud
  // 5. Peab olema funktsionaalne ehk käima tõmmatud (sulgude abil)

  function signup() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/signup", {
      method: "POST",
      body: JSON.stringify(person),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(json => {
      if (json.id) {
        navigate("/login");
      }
    });
  }

  return (
    <div>
      <label>First Name</label> <br />
      <input onChange={(e) => setPerson({...person, firstName: e.target.value})} type="text" /> <br />
      <label>Last Name</label> <br />
      <input onChange={(e) => setPerson({...person, lastName: e.target.value})} type="text" /> <br />
      <label>Email</label> <br />
      <input onChange={(e) => setPerson({...person, email: e.target.value})} type="text" /> <br />
      <label>Password</label> <br />
      <input onChange={(e) => setPerson({...person, password: e.target.value})} type="password" /> <br />
      <label>ROLE (only for testing purposes)</label> <br />
      <input onChange={(e) => setPerson({...person, role: e.target.value})} type="text" /> <br />
      <button onClick={signup}>Sign up</button>
    </div>
  )
}

export default Signup