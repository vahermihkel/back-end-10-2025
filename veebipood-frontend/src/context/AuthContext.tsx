import { createContext } from "react";
import { AuthToken } from "../models/AuthToken";

export const AuthContext = createContext({
  loading: false,
  person: {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  },
  isLoggedIn: false,
  permissions: "",
  personName: "",
  setPersonName: (_name: string) => {console.log(_name)},
  login: (_authToken: AuthToken) => {console.log(_authToken)},
  logout: () => {},
});
