import { useMemo, useState } from "react";
import Tabs from "../../components/controls/Tabs.jsx";

const BENEFIT_TABS = [
  { label: "DNEye prémie", value: "dneye" },
  { label: "Kontaktní čočky - aplikace", value: "contact_lenses_application" },
  { label: "SickDays", value: "sickdays" },
];

const BENEFIT_CONTENT = {
  dneye: {
    title: "DNEye prémie",
    description: "Modelový obsah pro benefit DNEye prémie.",
  },
  contact_lenses_application: {
    title: "Kontaktní čočky - aplikace",
    description: "Modelový obsah pro aplikaci kontaktních čoček.",
  },
  sickdays: {
    title: "SickDays",
    description: "Modelový obsah pro benefit SickDays.",
  },
};

function AgendaBenefits({ client }) {
  console.log("AgendaBenefits -user:", client.name);

  const [activeTab, setActiveTab] = useState(BENEFIT_TABS[0].value);
  const activeContent = useMemo(
    () => BENEFIT_CONTENT[activeTab] ?? BENEFIT_CONTENT.dneye,
    [activeTab],
  );

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="benefits-tabs-header">
          <Tabs items={BENEFIT_TABS} selectedValue={activeTab} onChange={setActiveTab} />
        </div>

        <div className="tabs-linked-container">
          <div className="show-items-panel">
            <div className="info-box info-box-wide">
              <h1>AgendaBenefits - external module</h1>
              <h2>{activeContent.title}</h2>
              <p>{activeContent.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendaBenefits;
