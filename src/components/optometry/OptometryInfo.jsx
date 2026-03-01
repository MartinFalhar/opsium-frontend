import { useUser } from "../../context/UserContext";

export default function OptometryInfo({ optometryItems, activeItem }) {
  const { headerClients, activeId, memory } = useUser();
  const activeClient = headerClients?.find((c) => c.id === activeId.client_id);

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
      birthDate.getDate(),
    );

    // Rozdíl dnů do dalšího roku
    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.round((nextBirthday - today) / msInDay);

    return { years, days };
  }

  if (!activeClient?.birth_date) {
    return (
      <div>
        <h6>{memory?.dpt}</h6>
      </div>
    );
  }

  const age = getAgeYearsAndDays(activeClient.birth_date);

  return (
    <div>
      {`Věk: ${age.years} let a ${age.days} dní.`}
      <h6>{memory?.dpt}</h6>
    </div>
  );
}
