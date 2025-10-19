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
    <div className="vistraining-container">
      <div className="vistraining-settings">
        <h1>Visual Training Settings</h1>

        {historyFromChild.length > 0 ? (
          <div className="bar-chart-root" style={{ width, height }}>
            {historyFromChild.map((val, i) => {
              const normalized = (val - min) / range; // 0..1
              const barHeight = Math.round(normalized * (height - 20)); 
              return (
                <div key={i} className="bar-wrapper" title={`${i}: ${val}`}>
                  <div
                    className="bar"
                    style={{ height: `${barHeight}px` }}
                  />
                  <div className="bar-label">{i}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No data</div>
        )}

        <button className="button-big" onClick={handleClick}>
          Start Test
        </button>
      </div>

      <div className="vistraining-help">
        <h1>Visual Training Help</h1>
      </div>
    </div>
  );
}

export default ClientVisTraining;