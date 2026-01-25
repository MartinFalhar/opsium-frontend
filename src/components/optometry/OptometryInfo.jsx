import {useState } from "react";
import { useUser } from "../../context/UserContext";


export default function OptometryInfo(optometryItems, activeItem) {
    const { user, headerClients, activeId, memory, setMemory} = useUser();
     // console.log(activeItem);
    const activeClient = headerClients.map((c, index) =>
    c.id === activeId.client_id ? index : null)
    
function getAgeYearsAndDays(birthTimestamp) {
  const birthDate = new Date(birthTimestamp);
  const today = new Date();

  // Výpočet celých let
  let years = today.getFullYear() - birthDate.getFullYear();

  // Pokud ještě letos neměl narozeniny → ubrat rok
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    years--;
  }

  // Nejbližší další narozeniny
  const nextBirthday = new Date(
    today.getFullYear() + (hasBirthdayPassed ? 1 : 0),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // Rozdíl dnů do dalšího roku
  const msInDay = 1000 * 60 * 60 * 24;
  const days = Math.round((nextBirthday - today) / msInDay);

  return { years, days };
}




    return (
        <div>
            {`Věk: ${getAgeYearsAndDays(headerClients[activeClient].birth_date).years} let a ${getAgeYearsAndDays(headerClients[activeClient].birth_date).days} dní.`}
            <h6>
                {memory.dpt}
            </h6>
        </div>
    );

};
