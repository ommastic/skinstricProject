import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import './Header.css'


export default function Header() {
  const location = useLocation();
  const showHeaderButton = location.pathname === '/' || location.pathname === '/landing';

  return (
    <header className='header-wrapper'>
      <div className='header-left'>
        <div><Link to='/' className='header__logo'>SKINSTRIC </Link><span className="text__intro">[ INTRO ]</span></div>
         {showHeaderButton && (
            <button className='header__right--button'>ENTER CODE</button>
          )}
      </div>
    </header>
  );
}

