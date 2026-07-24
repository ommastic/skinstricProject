import buttonIcon1 from '../../assets/button-icon-text-shrunk-left.svg';
import buttonIcon2 from '../../assets/button-icon-text-shrunk-right.svg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LandingPage.css';
import Header from '../../components/Header';

type HoverSide = 'left' | 'right' | null;

export default function Landing() {
  const navigate = useNavigate();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const currentX = useRef(0);
  const targetX = useRef(0);

  const [hoverSide, setHoverSide] = useState<HoverSide>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animateTitle = () => {

      // Gradually move the current position toward the target.
      currentX.current = THREE.MathUtils.lerp(
        currentX.current,
        targetX.current,
        0.08
      );

      if (titleRef.current) {
        titleRef.current.style.transform =
          `translate3d(${currentX.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateTitle);
    };

    animateTitle();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLeftHover = () => {
    setHoverSide('left');

    //Hovering left moves the title right
    targetX.current = 250;
  };

  const handleRightHover = () => {
    setHoverSide('right');

    //Hovering right moves the title left
    targetX.current = - 250;
  };

  const resetLanding = () => {
    setHoverSide(null);
    targetX.current = 0;
  };

  return (
    <div className='landing'>
      <Header />

      <main
        className={`main-wrapper ${hoverSide === 'left' ? 'main-wrapper--left-hover' : ''} ${hoverSide === 'right' ? 'main-wrapper--right-hover' : ''}`}
        onMouseLeave={resetLanding}
      >
        <div className='landing__hover-area landing__hover-area--left' onMouseEnter={handleLeftHover} aria-hidden='true' />
        <div className='landing__hover-area landing__hover-area--center' onMouseEnter={resetLanding} aria-hidden='true' />
        <div className='landing__hover-area landing__hover-area--right' onMouseEnter={handleRightHover} aria-hidden='true' />
        <svg className='left-svg' viewBox='0 0 300 600' preserveAspectRatio='none'>
          <line x1='0' y1='0' x2='300' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
          <line x1='0' y1='600' x2='300' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
        </svg>

        <svg className='right-svg' viewBox='0 0 300 600' preserveAspectRatio='none' aria-hidden='true'>
          <line x1='300' y1='0' x2='0' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
          <line x1='300' y1='600' x2='0' y2='300' stroke='#bbb' strokeWidth='2' strokeDasharray='1 2' />
        </svg>

        <button className='landing__page--left' onMouseEnter={handleLeftHover}>
          <img src={buttonIcon2} alt="" aria-hidden='true' />
        </button>

        <h1 ref={titleRef} className="main__header">Sophisticated<br /><span className='main__header--sub'>skincare</span></h1>
        <button className='landing__page--right' onMouseEnter={handleRightHover} onClick={() => navigate('/intro')}>
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