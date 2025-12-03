import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import OptometryRefractionARK from "../../components/optometry/OptometryRefractionARK";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";

function ModulesDB() {
  return [
    {
      id: 1,
      modul: 1,
      width: "w50",
      component: OptometryAnamnesis,
      values: {
        name: "Anamnéza",
        text: "Požadavek na plnou korekci",
      },
    },
    {
      id: 2,
      modul: 2,
      width: "w25",
      component: OptometryNaturalVisus,
      values: {
        name: "Naturální vizus",
        pV: "1.25",
        lV: "1.25+",
        bV: "2.0++",
        style: 0,
        text: "",
      },
    },
    {
      id: 3,
      modul: 3,
      width: "w25",
      component: OptometryRefractionARK,
      values: {
        name: "OBJEKTIVNÍ refrakce",
        pS: "-1.23",
        pC: "-1.79",
        pA: "179",
        lS: "+6.85",
        lC: "-1.47",
        lA: "123",
        text: "",
      },
    },
    {
      id: 4,
      modul: 3,
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - plný zápis",
        pS: "-3,75",
        pC: "-4,50",
        pA: "180",
        pP: "2,5",
        pB: "90",
        pAdd: "-3,25",
        lS: "+4,50",
        lC: "90",
        lA: "122",
        lP: "2,5",
        lB: "270",
        lAdd: "+2,50",
        pV: "0,63+",
        lV: "0,8+",
        bV: "1,25+",
        style: 0,
        text: "",
      },
    },
    {
      id: 5,
      modul: 3,
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - pohodlná korekce vzhledem k vysokému CYL",
        pS: -3.75,
        pC: -4.5,
        pA: 180,
        pP: 2.5,
        pB: 90,
        pAdd: -3.25,
        lS: +4.5,
        lC: 90,
        lA: 122,
        lP: 2.5,
        lB: 270,
        lAdd: +2.5,
        pV: 0.633,
        lV: 0.83,
        bV: 1.253,
        text: "",
      },
    },
  ];
}

export default ModulesDB;
