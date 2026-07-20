import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import backButton from '../../assets/button-back.svg';
import './DemographicsPage.css';

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
    }).join(' ');
};

const categoryNames: Record<Category, string> = {
  race: 'Race',
  age: 'Age',
  gender: 'Sex',
};


export default function DemographicsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedAnalysisData = (location.state as { analysisData?: AnalysisData; } | null)?.analysisData ?? null;
  const analysisData = passedAnalysisData ?? getSavedAnalysisData();

  const initialSelections = useMemo<SelectedDemographics>(() => {
    return {
      race: getHighestScoreLabel(analysisData?.race),
      age: getHighestScoreLabel(analysisData?.age),
      gender: getHighestScoreLabel(analysisData?.gender),
    };
  }, [analysisData]);

  const [activeCategory, setActiveCategory] =
    useState<Category>("race");

  const [selectedDemographics, setSelectedDemographics] =
    useState<SelectedDemographics>(initialSelections);

  if (!analysisData) {
    return (
      <div className="demographics-page">
        <Header />

        <main className="demographics-page__content">
          <section className="demographics-page__heading">
            <p className="demographics-page__eyebrow">A.I. ANALYSIS</p>
            <h1 className="demographics-page__title">DEMOGRAPHICS</h1>
            <p className="demographics-page__subtitle">
              PREDICTED RACE &amp; AGE
            </p>
          </section>

          <div className="demographics-page__empty">
            No analysis data was found. Upload an image first.
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

  const selectedScore =
    categoryScores[activeCategory][selectedLabel] ?? 0;

  const handleSelectScore = (label: string) => {
    setSelectedDemographics((currentSelections) => ({
      ...currentSelections,
      [activeCategory]: label,
    }));
  };

  const handleReset = () => {
    setSelectedDemographics(initialSelections);
    setActiveCategory("race");
  };

  const handleConfirm = () => {
    sessionStorage.setItem(
      "skinstric.selectedDemographics",
      JSON.stringify(selectedDemographics),
    );

    navigate("/summary", {
      state: {
        selectedDemographics,
        analysisData,
      },
    });
  };

  return (
    <div className="demographics-page">
      <Header />

      <main className="demographics-page__content">
        <section className="demographics-page__heading">
          <p className="demographics-page__header">A.I. ANALYSIS</p>
          <h1 className="demographics-page__title">DEMOGRAPHICS</h1>
          <p className="demographics-page__subtitle">
            PREDICTED RACE &amp; AGE
          </p>
        </section>

        <section className="demographics-layout">
          <aside className="demographics-sidebar">
            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === "race"
                ? "demographics-sidebar__card--active"
                : ""
                }`}
              onClick={() => setActiveCategory("race")}
            >
              <span className="demographics-sidebar__value">
                {formatLabel(selectedDemographics.race)}
              </span>

              <span className="demographics-sidebar__label">
                RACE
              </span>
            </button>

            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === "age"
                ? "demographics-sidebar__card--active"
                : ""
                }`}
              onClick={() => setActiveCategory("age")}
            >
              <span className="demographics-sidebar__value">
                {formatLabel(selectedDemographics.age)}
              </span>

              <span className="demographics-sidebar__label">
                AGE
              </span>
            </button>

            <button
              type="button"
              className={`demographics-sidebar__card ${activeCategory === "gender"
                ? "demographics-sidebar__card--active"
                : ""
                }`}
              onClick={() => setActiveCategory("gender")}
              disabled={!analysisData.gender}
            >
              <span className="demographics-sidebar__value">
                {formatLabel(selectedDemographics.gender)}
              </span>

              <span className="demographics-sidebar__label">
                SEX
              </span>
            </button>
          </aside>

          <section className="demographics-result">
            <h2 className="demographics-result__title">
              {formatLabel(selectedLabel)}
            </h2>

            <div className="demographics-result__chart-wrapper">
              <div
                className="demographics-result__chart"
                style={
                  {
                    "--confidence": `${selectedScore * 100}`,
                  } as React.CSSProperties
                }
              >
                <div className="demographics-result__chart-inner">
                  <span className="demographics-result__percentage">
                    {(selectedScore * 100).toFixed(2)}
                  </span>

                  <span className="demographics-result__percentage-symbol">
                    %
                  </span>
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
                    <button
                      type="button"
                      className={`demographics-confidence__item ${isSelected
                        ? "demographics-confidence__item--selected"
                        : ""
                        }`}
                      onClick={() => handleSelectScore(label)}
                    >
                      <span className="demographics-confidence__name">
                        <span
                          className="demographics-confidence__diamond"
                          aria-hidden="true"
                        />

                        {formatLabel(label)}
                      </span>

                      <span className="demographics-confidence__score">
                        {(score * 100).toFixed(2)}%
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </section>

        <p className="demographics-page__instruction">
          If A.I. estimate is wrong, select the correct one.
        </p>

        <footer className="demographics-page__actions">
          <button
            type="button"
            className="demographics-page__back"
            onClick={() => navigate(-1)}
          >
            <img src={backButton} alt="" aria-hidden="true" />
          </button>

          <div className="demographics-page__decision-buttons">
            <button
              type="button"
              className="demographics-page__reset"
              onClick={handleReset}
            >
              RESET
            </button>

            <button
              type="button"
              className="demographics-page__confirm"
              onClick={handleConfirm}
            >
              CONFIRM
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}