import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import english from "../assets/english.png"
import estonian from "../assets/estonian.png"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


function NavigationBar() {
  const { t, i18n } = useTranslation();
  const {permissions, personName , isLoggedIn, logout} = useContext(AuthContext);
  
  function updateLanguage(newLanguage: string) {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  }

  return (
    <div>
      <Link to="/">
        <button>{t('nav.homepage')}</button>
      </Link>

      <Link to="/cart">
        <button>{t('nav.cart')}</button>
      </Link>

  {isLoggedIn ?
    <>
      {permissions === "SUPERADMIN" &&
        <Link to="/persons">
          <button>{t('nav.persons')}</button>
        </Link>
      }
      {(permissions === "ADMIN" || permissions === "SUPERADMIN") &&
        <Link to="/admin">
          <button>{t('nav.admin')}</button>
        </Link>
      }
      <span>Hi, {personName}</span>
      <Link to="/profile">
        <button>{t('nav.profile')}</button>
      </Link>
      <Link to="/orders">
        <button>My orders</button>
      </Link>
      <button onClick={logout}>Log out</button>
    </> :
    <>
      <Link to="/login">
        <button>{t('nav.login')}</button>
      </Link>
      <Link to="/signup">
        <button>{t('nav.signup')}</button>
      </Link>
    </>  
    }

      <img onClick={() => updateLanguage("en")} className="icon" src={english} alt="" />
      <img onClick={() => updateLanguage("et")} className="icon" src={estonian} alt="" />
    <br /><br /><br />
    </div>
  )
}

export default NavigationBar