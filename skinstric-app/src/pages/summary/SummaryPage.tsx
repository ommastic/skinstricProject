import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, type CSSProperties } from "react";
import backButton from '../../assets/button-back.svg';
import backHomeButton from '../../assets/home-forward.svg';
import '../demographics/DemographicsPage.css';
import './SummaryPage.css';

type AnalysisScores = Record<string, number>;

type AnalysisData = {
  race: AnalysisScores;
  age: AnalysisScores;
  gender?: AnalysisScores;
};

type Category = 'race' | 'age' | 'gender';

type SelectedDemographics = {
  race: string;
  age: string;
  gender: string;
};

type FormattedScore = {
  label: string;
  score: number;
};

const ANALYSIS_STORAGE_KEY = 'skinstric.phaseTwoAnalysis';
const SELECTED_DEMOGRAPHICS_STORAGE_KEY = 'skinstric.selectedDemographics';

const getSavedAnalysisData = (): AnalysisData | null => {
  const storedAnalysisData = sessionStorage.getItem(ANALYSIS_STORAGE_KEY);

  if (!storedAnalysisData) {
    return null;
  }

  try {
    return JSON.parse(storedAnalysisData) as AnalysisData;
  } catch {
    return null;
  }
};

const getSavedSelectedDemographics = (): SelectedDemographics | null => {
  const storedSelectedDemographics = sessionStorage.getItem(SELECTED_DEMOGRAPHICS_STORAGE_KEY);

  if (!storedSelectedDemographics) {
    return null;
  }

  try {
    return JSON.parse(storedSelectedDemographics) as SelectedDemographics;
  } catch {
    return null;
  }
};

const sortScores = (scores: AnalysisScores): FormattedScore[] => {
  return Object.entries(scores)
    .sort(([, leftValue], [, rightValue]) => rightValue - leftValue)
    .map(([label, score]) => ({
      label,
      score,
    }));
};

const getHighestScoreLabel = (scores?: AnalysisScores): string => {
  if (!scores) {
    return '';
  }

  return sortScores(scores)[0]?.label ?? '';
};

const formatLabel = (label: string): string => {
  return label
    .split(' ')
    .map((word) => {
      if (/^\d/.test(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const categoryNames: Record<Category, string> = {
  race: 'Race',
  age: 'Age',
  gender: 'Sex',
};

export default function SummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    selectedDemographics?: SelectedDemographics;
    analysisData?: AnalysisData;
  } | null;

  const analysisData = state?.analysisData ?? getSavedAnalysisData();

  const getValidSelection = (savedLabel: string, scores?: AnalysisScores): string => {
    if (!scores) {
      return '';
    }
    if (savedLabel && savedLabel in scores) {
      return savedLabel;
    }
    return getHighestScoreLabel(scores);
  };

  const selectedDemographics = useMemo<SelectedDemographics | null>(() => {
    const savedSelections = state?.selectedDemographics ?? getSavedSelectedDemographics();

    if (!savedSelections) {
      return null;
    }

    if (!analysisData) {
      return savedSelections;
    }

    return {
      race: getValidSelection(savedSelections.race, analysisData.race),
      age: getValidSelection(savedSelections.age, analysisData.age),
      gender: getValidSelection(savedSelections.gender, analysisData.gender),
    };
  }, [analysisData, state?.selectedDemographics]);

  const [activeCategory, setActiveCategory] = useState<Category>('race');

  if (!analysisData || !selectedDemographics) {
    return (
      <div className="demographics-page">
        <Header />

        <main className="demographics-page__content">
          <section className="demographics-page__heading">
            <p className="demographics-page__header">A.I. ANALYSIS</p>
            <h1 className="demographics-page__title">SUMMARY</h1>
            <p className="demographics-page__subtitle">CONFIRMED DEMOGRAPHICS</p>
          </section>

          <div className="demographics-page__empty">
            No confirmed demographics found. Confirm selections on the demographics page first.
          </div>
        </main>
      </div>
    );
  }

  const categoryScores: Record<Category, AnalysisScores> = {
    race: analysisData.race,
    age: analysisData.age,
    gender: analysisData.gender ?? {},
  };

  const activeScores = sortScores(categoryScores[activeCategory]);
  const selectedLabel = selectedDemographics[activeCategory];

  const selectedScore = categoryScores[activeCategory][selectedLabel] ?? 0;

  return (
    <div className="demographics-page summary-page">
      <Header />

      <main className="demographics-page__content">
        <section className="demographics-page__heading">
          <p className="demographics-page__header">A.I. ANALYSIS</p>
          <h1 className="demographics-page__title">SUMMARY</h1>
          <p className="demographics-page__subtitle">CONFIRMED DEMOGRAPHICS</p>
        </section>

        <section className="demographics-layout">
          <aside className="demographics-sidebar">
            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === 'race' ? 'demographics-sidebar__card--active' : ''}`}
              onClick={() => setActiveCategory('race')}
            >
              <span className="demographics-sidebar__value">{formatLabel(selectedDemographics.race)}</span>
              <span className="demographics-sidebar__label">RACE</span>
            </button>

            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === 'age' ? 'demographics-sidebar__card--active' : ''}`}
              onClick={() => setActiveCategory('age')}
            >
              <span className="demographics-sidebar__value">{formatLabel(selectedDemographics.age)}</span>
              <span className="demographics-sidebar__label">AGE</span>
            </button>

            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === 'gender' ? 'demographics-sidebar__card--active' : ''}`}
              onClick={() => setActiveCategory('gender')}
              disabled={!analysisData.gender}
            >
              <span className="demographics-sidebar__value">{formatLabel(selectedDemographics.gender)}</span>
              <span className="demographics-sidebar__label">SEX</span>
            </button>
          </aside>

          <section className="demographics-result">
            <h2 className="demographics-result__title">{formatLabel(selectedLabel)}</h2>

            <div className="demographics-result__chart-wrapper">
              <div
                className="demographics-result__chart"
                style={
                  {
                    '--confidence': `${selectedScore * 100}`,
                  } as CSSProperties
                }
              >
                <div className="demographics-result__chart-inner">
                  <span className="demographics-result__percentage">{(selectedScore * 100).toFixed(2)}</span>
                  <span className="demographics-result__percentage-symbol">%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="demographics-confidence">
            <header className="demographics-confidence__header">
              <h2>{categoryNames[activeCategory]}</h2>
              <span>A.I. CONFIDENCE</span>
            </header>

            <ul className="demographics-confidence__list">
              {activeScores.map(({ label, score }) => {
                const isSelected = label === selectedLabel;

                return (
                  <li key={label}>
                    <div className={`demographics-confidence__item ${isSelected ? 'demographics-confidence__item--selected' : ''}`}
                      aria-current={isSelected ? 'true' : undefined}
                    >
                      <span className="demographics-confidence__name">
                        <span className="demographics-confidence__diamond" aria-hidden="true" />
                        {formatLabel(label)}
                      </span>

                      <span className="demographics-confidence__score">{(score * 100).toFixed(2)}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </section>

        <p className="demographics-page__instruction">These values were confirmed on the demographics page.</p>

        <footer className="demographics-page__actions">
          <button
            type="button"
            className="demographics-page__back"
            onClick={() => navigate(-1)}
          >
            <img src={backButton} alt="" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="summary-page__home"
            onClick={() => navigate('/')}
          >
            <img src={backHomeButton} alt="" aria-hidden="true" />
            <span className="summary-page__home-label">HOME</span>
          </button>
        </footer>
      </main>
    </div>
  );
}