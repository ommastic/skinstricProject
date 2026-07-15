import rectangle1 from '../../assets/Rectangle 2778.svg';
import rectangle2 from '../../assets/Rectangle 2779.svg';
import buttonIcon1 from '../../assets/button-icon-text-shrunk-left.svg';
import buttonIcon2 from '../../assets/button-icon-text-shrunk-right.svg';
import './Landing.css';

export default function Landing() {

  return (
    <div className='landing'>
      <header className='header-wrapper'>
        <div className='header-left'>
          <p>SKINsTRIC <span>[ INTRO ]</span></p>
          <button className='header__right--button'>ENTER CODE</button>
        </div>
      </header>

      <main className='main-wrapper'>
        <img className='rectangle rectangle--right' src={rectangle1} alt="" aria-hidden='true' />
        <img className='rectangle rectangle--left' src={rectangle2} alt="" aria-hidden='true' />

        <button className='landing__page--left'>
          <img src={buttonIcon2} alt="" aria-hidden='true' />
        </button>

        <h1 className="main__header">Sophisticated<br />skincare</h1>
        <button className='landing__page--right'>
          <img src={buttonIcon1} alt='Take Test' aria-hidden='true' />
        </button>
      </main>

      <footer className='landing-footer'>
        <p className='footer__description'>
          SKINSTRIC DEVELOPED AN A.I THAT CREATES A
          <br />
          HIGHLY-PERSONALIZED ROUTINE TAILORED TO
          <br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </footer>
    </div>

  );
}