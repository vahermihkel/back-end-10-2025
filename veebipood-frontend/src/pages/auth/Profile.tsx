import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Person } from "../../models/Person";

function Profile() {
  const {person, setPersonName} = useContext(AuthContext);
  const [personData, setPersonData] = useState<Person>({id: 0, firstName: "", lastName: "", email: "", password: "", role: ""});
  const [passwordChangeData, setPasswordChangeData] = useState({personId: 0, oldPassword: "", newPassword: ""});
  const token = "Bearer " + sessionStorage.getItem("token");

  useEffect(() => {
    setPersonData(person);
    // setPasswordChangeData({...passwordChangeData, personId: person.id})
  }, [person]);

  function update() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/update-profile", {
      method: "PUT",
      body: JSON.stringify(personData),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.message && json.status && json.timestamp) {
          alert(json.message);
          return;
        }
        setPersonName(personData.firstName);
        alert("Profiil edukalt muudetud!")
      })
  }

  function updatePassword() {
    passwordChangeData.personId = Number(personData.id);
    console.log(passwordChangeData);
    fetch(import.meta.env.VITE_BACKEND_URL + "/update-password", {
      method: "PATCH",
      body: JSON.stringify(passwordChangeData),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.message && json.status && json.timestamp) {
          alert(json.message);
          return;
        }
        alert("Parool edukalt muudetud!")
      })
  }

  return (
    <div>
      <label>First name</label> <br />
      <input 
        defaultValue={person.firstName}
        onChange={(e) => setPersonData({...personData, firstName: e.target.value})} 
        type="text" /> <br />
      <label>Last name</label> <br />
      <input 
        defaultValue={person.lastName} 
        onChange={(e) => setPersonData({...personData, lastName: e.target.value})} 
        type="text" /> <br />
      <label>Email</label> <br />
      <input disabled defaultValue={person.email} type="text" /> <br />
      <button onClick={update}>Update</button>
      {person.role === "ADMIN" && <div>Oled admin</div>}
      {person.role === "SUPERADMIN" && <div>Oled superadmin</div>}

      <br /><br />

      <label>Old password</label> <br />
      <input 
        onChange={(e) => setPasswordChangeData({...passwordChangeData, oldPassword: e.target.value})} 
        type="text" /> <br />
      <label>New password</label> <br />
      <input 
        onChange={(e) => setPasswordChangeData({...passwordChangeData, newPassword: e.target.value})} 
        type="text" /> <br />
      <button onClick={updatePassword}>Update password</button>
    </div>
  )
}

export default Profile