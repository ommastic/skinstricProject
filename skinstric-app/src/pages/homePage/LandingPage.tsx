import buttonIcon1 from '../../assets/button-icon-text-shrunk-left.svg';
import buttonIcon2 from '../../assets/button-icon-text-shrunk-right.svg';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Header from '../../components/Header';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className='landing'>
      <Header />

      <main className='main-wrapper'>
        <svg className='left-svg' viewBox='0 0 300 600' preserveAspectRatio='none'>
          <line x1='0' y1='0' x2='300' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
          <line x1='0' y1='600' x2='300' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
        </svg>

        <svg className='right-svg' viewBox='0 0 300 600' preserveAspectRatio='none' aria-hidden='true'>
          <line x1='300' y1='0' x2='0' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
          <line x1='300' y1='600' x2='0' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
        </svg>
        
        <button className='landing__page--left'>
          <img src={buttonIcon2} alt="" aria-hidden='true' />
        </button>

        <h1 className="main__header">Sophisticated<br />skincare</h1>
        <button className='landing__page--right' onClick={() => navigate('/intro')}>
          <img src={buttonIcon1} alt='Take Test' aria-hidden='true' />
        </button>
   

        <p className='landing__description'>
          SKINSTRIC DEVELOPED AN A.I THAT CREATES A
          <br />
          HIGHLY-PERSONALIZED ROUTINE TAILORED TO
          <br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </main>
    </div>
  );
}