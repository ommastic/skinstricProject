import Header from "../../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backButton from '../../assets/button-back.svg'
import proceedButton  from '../../assets/button-proceed.svg'
import './Introduction.css'


const API_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";

type FormStep = 'name' | 'location' | 'submitting' | 'success';

type ApiResponse = {
  SUCCUSS?: string;
  SUCCESS?: string;
};


export default function Introduction() {
  const navigate = useNavigate();

  const [step, setStep] = useState<FormStep>("name");
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setErrorMessage('');
    setStep('location');
  };

  const handleLocationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!location.trim()) {
      setErrorMessage("Please enter your location.");
      return;
    }
    try {
      setErrorMessage('');
      setStep('submitting');

      const response = await axios.post<ApiResponse>(API_URL, {
        name: name.trim(),
        location: location.trim()
      });

      setMessage(
        response.data.SUCCESS ?? 'Proceed for the next step',
      );
      setStep("success");
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to submit your information. Please try again.");
      setStep('location');
    }
  };

  const handleBack = () => {
    if (step === 'location') {
      setErrorMessage('');
      setStep('name');
      return;
    }
    navigate('/');
  };

  return (
    <div className="introduction">
      <Header />
      <main className="analysis">
        <p className="introduction__header">TO START ANALYSIS</p>
        <div className='rotating-squares' aria-hidden='true'>
          <span className='rotating-square rotating-square__one'/>
          <span className='rotating-square rotating-square__two'/>
          <span className='rotating-square rotating-square__three'/>
        </div>

        <section className="analysis__content">
          {step === 'name' && (
            <form id="name-form" onSubmit={handleNameSubmit} className="analysis__form">
              <label htmlFor='name' className="analysis__prompt">
                CLICK TO TYPE
              </label>

              <input type="text" id="name" className="analysis__input" value={name} onChange={(event) => setName(event.target.value)}
                placeholder='Introduce Yourself' autoComplete='name' autoFocus />
            </form>
          )}
          {step === 'location' && (
            <form id="location-form" onSubmit={handleLocationSubmit} className="analysis__form">
              <label htmlFor='location' className="analysis__prompt">
                WHERE ARE YOU FROM
              </label>

              <input type="text" id="location" className="analysis__input" value={location} onChange={(event) => setLocation(event.target.value)}
                placeholder='Your city name' autoComplete='address-level2' autoFocus />
            </form>
          )}

          {step === 'submitting' && (
            <div className='analysis__status'><p>Processing...</p></div>
          )}

          {step === 'success' && (
            <div className='analysis__status'>
              <p className="analysis__prompt">Thank you!</p>
              <p className="analysis__success">{message}</p>
            </div>
          )}

          {errorMessage && (
            <p className="analysis__error" role='alert'>
              {errorMessage}</p>
          )}
        </section>

        <div className="analysis__actions">
          <button className="analysis__back" type='button' onClick={handleBack}>
            <span className="analysis__back-diamond">
              <img src="" alt="" />
            </span>
            <span><img src={backButton} alt='back button' aria-hidden='true' /></span>
          </button>

          {step === 'name' && (
            <button className="analysis__continue" type='submit' form="name-form">
            </button>
          )}

          {step === 'success' && (
            <button className="analysis__continue" type='button' onClick={() => navigate('/')}>
              <img src={proceedButton} alt='forward-button' aria-hidden='true' />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};