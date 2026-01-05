import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function Login() {
  const [loginData, setLoginData] = useState({email: "", password: ""});
  const {login} = useContext(AuthContext);
  const { t } = useTranslation();

  function loginHandler() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(json => {
        if (json.message && json.status && json.timestamp) {
          // alert(json.message);
          getErrorMessage(json.message);
          return;
        }
        login(json);
    });
  }

  function getErrorMessage(message: string) {
    const errorMessage = t("error." + message + "katki");
    if (errorMessage.startsWith("error.")) {
      alert(t("error.generic"));
    } else {
      alert(errorMessage);
    }
  }

  return (
    <div>
      <label>Email</label> <br />
      <input onChange={(e) => setLoginData({...loginData, email: e.target.value})} type="text" /> <br />
      <label>Password</label> <br />
      <input onChange={(e) => setLoginData({...loginData, password: e.target.value})} type="password" /> <br />
      <button onClick={loginHandler}>Log in</button>
    </div>
  )
}

export default Login