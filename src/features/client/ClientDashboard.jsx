export default function ClientDashboard({ client }) {
  // Přidáváme kontrolu existence klienta
  // TOHLE BLIKA
  // if (!client) {
  //   return (
  //     <div className="client-dashboard">
  //       <div className="info-box">
  //         <h1>Načítání dat klienta...</h1>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="client-dashboard">
      <div className="info-box">
        <h1>CLIENT DASHBOARD - external module</h1>
      </div>
      <div className="info-box">
        <p>Jméno:</p>
        <h1>{`${client?.name} ${client?.surname}`}</h1>
      </div>{" "}
      <div className="info-box">
        <p>Adresa:</p>
        <h1>{client?.street}</h1>
        <h1>{client?.city}</h1>
        <h1>{client?.postalCode}</h1>
      </div>
      <div className="info-box">
        <p>Datum narození:</p>
        <h1>{client?.birthdate}</h1>
      </div>
    </div>
  );
}
