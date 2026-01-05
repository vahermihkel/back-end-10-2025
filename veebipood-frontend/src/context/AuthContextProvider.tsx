import { type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthToken } from "../models/AuthToken";

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [reTried, setReTried] = useState(false);
  const navigate = useNavigate();
  const [personName, setPersonName] = useState("");
  const [person, setPerson] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });
  const [permissions, setPermissions] = useState("CUSTOMER");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("USE_EFFECT_ALGUS");
    const token = sessionStorage.getItem("token");
    const expiration = sessionStorage.getItem("expiration");
    const idToken = sessionStorage.getItem("idToken");
    if (token && expiration && idToken) {
      findPerson(token, idToken);
    } else {
      setLoading(false);
      sessionStorage.clear();
    }  
  }, []);

  function findPerson(token: string, idToken: string) {
      console.log("STARTING TO FIND PERSON");
      fetch(import.meta.env.VITE_BACKEND_URL + "/person", {
        headers: {
          "Authorization": "Bearer " + token
        }
      }).then(res => {
        if (res.ok) {
          console.log("FIND PERSON _ OK");
          return res.json();
        } else {
          if (!reTried) {
            console.log("FIND PERSON _ RETRYING");
            updateToken(idToken);
          }
          console.log("FIND PERSON _ RETURNING RES" + JSON.stringify(res));
          return res;
        }
      })
        .then(json => {
          console.log("FIND PERSON _ IN SECOND THEN: " + JSON.stringify(json));
          setLoading(false);
          if (json.id) {
            console.log("FIND PERSON _ INSIDE IF" + json.id);
            setLoggedIn(true);
            setPerson(json);
            setPermissions(json.role);
            setPersonName(json.firstName);
            return;
          }
          setLoggedIn(false);
        });
  }

  function updateToken(idToken: string) {
    console.log("UPDATE TOKEN _ STARTING FUNCTION" + idToken);
    fetch(import.meta.env.VITE_BACKEND_URL + "/update-token", {
      headers: {
        "Authorization": "Bearer " + idToken
      }
    }).then(res => res.json())
      .then(json => {
        console.log("UPDATE TOKEN _ SECOND THEN" + JSON.stringify(json))
        if (json) {
          sessionStorage.setItem("token", json.accessToken);
          sessionStorage.setItem("expiration", json.expiration.toString());
          findPerson(json.accessToken, json.refreshToken);
          setReTried(true);
        } else {
          sessionStorage.clear();
        }
      })
  }
  
  function login(authToken: AuthToken) {
    sessionStorage.setItem("token", authToken.accessToken);
    sessionStorage.setItem("idToken", authToken.refreshToken);
    sessionStorage.setItem("expiration", authToken.expiration.toString());
    findPerson(authToken.accessToken, authToken.refreshToken);
    setLoggedIn(true);
    navigate("/profile");
  }

  function logout() {
    setLoggedIn(false);
    setPerson({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: ""
    });
    setPermissions("CUSTOMER");
    setPersonName("");
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{
      loading,
      person, 
      isLoggedIn,
      permissions, 
      personName, 
      setPersonName,
      login, 
      logout
      }}>
      {children}
    </AuthContext.Provider>
  )
}