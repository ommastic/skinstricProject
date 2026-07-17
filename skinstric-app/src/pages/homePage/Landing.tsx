import rectangle1 from '../../assets/Rectangle 2778.svg';
import rectangle2 from '../../assets/Rectangle 2779.svg';
import buttonIcon1 from '../../assets/button-icon-text-shrunk-left.svg';
import buttonIcon2 from '../../assets/button-icon-text-shrunk-right.svg';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import Header from '../../components/Header';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className='landing'>
      <Header />

      <main className='main-wrapper'>
        <img className='rectangle rectangle--right' src={rectangle1} alt="" aria-hidden='true' />
        <img className='rectangle rectangle--left' src={rectangle2} alt="" aria-hidden='true' />

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