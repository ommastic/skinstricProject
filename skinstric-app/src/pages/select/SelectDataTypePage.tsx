import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import backButton from "../../assets/button-back.svg";
import forwardButton from "../../assets/button-proceed.svg";
import './SelectDataTypePage.css';


export default function SelectDataTypePage() {
  const navigate = useNavigate();
  return (
    <div className="select-data-page">
      <Header />
      <main className="select-data-page__content">
        <section className="select-data-page__intro">
          <h1>A.I. ANALYSIS</h1>
          <p>A.I. HAS ESTIMATED THE FOLLOWING.</p>
          <p>FIX STIMATED INFORMATION IF NEEDED.</p>
        </section>

        <section className="analysis__menu">
          <span className='analysis__outer-diamond analysis__outer-diamond--one' aria-hidden='true' />
          <span className='analysis__outer-diamond analysis__outer-diamond--two' aria-hidden='true' />
          <span className='analysis__outer-diamond analysis__outer-diamond--three' aria-hidden='true' />

          <button type="button" className="analysis__diamond analysis__diamond--demographics" onClick={() => navigate("/demographics")}>
            <span>DEMOGRAPHICS</span>
          </button>

          <div className="analysis__diamond analysis__diamond--disabled analysis__diamond--cosmetic" aria-disabled='true'>
            <span>
              SKIN TYPE
              <br />
              DETAILS
            </span>
          </div>

          <div className="analysis__diamond analysis__diamond--disabled analysis__diamond--skin" aria-disabled='true'>
            <span>
              COSMETIC
              <br />
              CONCERNS
            </span>
          </div>

          <div className="analysis__diamond analysis__diamond--disabled analysis__diamond--weather" aria-disabled='true'>
            <span>
              WEATHER
            </span>
          </div>
        </section>

        <button
          type="button"
          className="select-data-page__nav-button select-data-page__nav-button--back"
          onClick={() => navigate(-1)}
        >
          <img src={backButton} alt="Back" />
        </button>

        <button
          type="button"
          className="select-data-page__nav-button select-data-page__nav-button--forward"
          onClick={() => navigate("/demographics")}
        >
          <img src={forwardButton} alt="Forward" />
        </button>
      </main>
    </div>
  );
}