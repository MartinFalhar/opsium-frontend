import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ClientVisTraining.css";

function ClientVisTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const historyFromChild = location.state?.history || [];

  const width = 700;
  const height = 250;

  const min = Math.min(...historyFromChild);
  const max = Math.max(...historyFromChild);
  const range = max - min || 1;

  const handleClick = () => {
    navigate("/visual-training-testing");
  };

  return (
    <div className="container">
      <div className="left-container">
        <h1>Visual Training Settings</h1>
        <section>
          <h2>Nástroje pro trénink zraku</h2>
          <ul>
            <li>
              <h3>AmblyoPlay</h3>
              <p>
                Jak sám uvádíte, AmblyoPlay je jeden z nejznámějších a
                nejrozšířenějších nástrojů v této oblasti. Využívá terapeutické
                hry a speciální červeno-modré brýle, aby každé oko dostávalo
                individuální podněty a mozek se učil správně používat obě oči.
              </p>
            </li>
            <li>
              <h3>VisionUp</h3>
              <p>
                Tato aplikace využívá umělou inteligenci k vytváření
                personalizovaných očních cvičení, která mají pomoci s únavou
                očí, rozmazaným viděním a posílením očních svalů.
              </p>
            </li>
            <li>
              <h3>EYEBAB Vision Training</h3>
              <p>
                Tato platforma nabízí širokou škálu digitalizovaných cvičení,
                která vycházejí z tradičních optometrických metod. Je určena pro
                kliniky, které mohou sledovat pokroky svých pacientů a
                přiřazovat jim cvičení.
              </p>
            </li>
            <li>
              <h3>NeuroVisual Trainer</h3>
              <p>
                Platforma určená pro vzdálenou i osobní terapii. Nabízí více než
                100 interaktivních a video cvičení a umožňuje specialistům
                přizpůsobit režim pro každého klienta a sledovat jeho pokroky v
                reálném čase.
              </p>
            </li>
            <li>
              <h3>Vizual Edge</h3>
              <p>
                Tento nástroj se zaměřuje na trénink zrakových a kognitivních
                dovedností, což je důležité nejen pro pacienty s problémy
                binokulárního vidění, ale také pro sportovce a lidi, kteří
                chtějí zlepšit svou zrakovou výkonnost.
              </p>
            </li>
            <li>
              <h3>Optics Trainer</h3>
              <p>
                Aplikace, která nabízí různé hry pro trénink konvergence,
                divergence, stereoskopického vidění a dalších vizuálních
                dovedností. Vytváří personalizované denní tréninky, které se
                přizpůsobují pokroku uživatele.
              </p>
            </li>
          </ul>
        </section>
        {historyFromChild.length > 0 ? (
          <div className="bar-chart-root" style={{ width, height }}>
            {historyFromChild.map((val, i) => {
              const normalized = (val - min) / range; // 0..1
              const barHeight = Math.round(normalized * (height - 20));
              return (
                <div key={i} className="bar-wrapper" title={`${i}: ${val}`}>
                  <div className="bar" style={{ height: `${barHeight}px` }} />
                  <div className="bar-label">{i}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="info-box">
            <p>Press START to preceed exercise.</p>
            <p>The graph with the activity will be shown here.</p>
          </div>
        )}

        <button className="button-big" onClick={handleClick}>
          Start Test
        </button>
      </div>

      <div className="right-container">
        <h1>Visual Training Help</h1>
      </div>
    </div>
  );
}

export default ClientVisTraining;
