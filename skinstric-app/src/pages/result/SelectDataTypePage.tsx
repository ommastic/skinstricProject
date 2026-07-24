import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import backButton from "../../assets/button-back.svg";
import getSummary from "../../assets/getSummary.svg";
import './SelectDataTypePage.css';

type AnalysisScores = Record<string, number>;

type AnalysisData = {
  race: AnalysisScores;
  age: AnalysisScores;
  gender?: AnalysisScores;
};


export default function SelectDataTypePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = (location.state as { analysisData?: AnalysisData } | null)?.analysisData ?? null;

  const navigateToDemographics = () => {
    navigate("/demographics", { state: { analysisData } });
  };

  return (
    <div className="select-data-page">
      <Header />
      <main className="select-data-page__content">
        <section className="select-data-page__intro">
          <p className="select-data-page__header">A.I. ANALYSIS</p>
          <p className="select-data-page__sub-header">A.I. HAS ESTIMATED THE FOLLOWING.</p>
          <p className="select-data-page__sub-header">FIX ESTIMATED INFORMATION IF NEEDED.</p>
        </section>

        <section className="result__menu">
          <span className='result__outer-diamond result__outer-diamond--one' aria-hidden='true' />
          <span className='result__outer-diamond result__outer-diamond--two' aria-hidden='true' />
          <span className='result__outer-diamond result__outer-diamond--three' aria-hidden='true' />

          <button type="button" className="result__diamond result__diamond--demographics" onClick={navigateToDemographics}>
            <span>DEMOGRAPHICS</span>
          </button>

          <div className="result__diamond result__diamond--disabled result__diamond--cosmetic" aria-disabled='true'>
            <span>
              SKIN TYPE
              <br />
              DETAILS
            </span>
          </div>

          <div className="result__diamond result__diamond--disabled result__diamond--skin" aria-disabled='true'>
            <span>
              COSMETIC
              <br />
              CONCERNS
            </span>
          </div>

          <div className="result__diamond result__diamond--disabled result__diamond--weather" aria-disabled='true'>
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
          onClick={navigateToDemographics}
        >
          <img src={getSummary} alt="Forward" />
        </button>
      </main>
    </div>
  );
}