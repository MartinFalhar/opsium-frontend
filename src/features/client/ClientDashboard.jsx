export default function ClientDashboard({ client }) {
  return (
    <div className="client-dashboard">
      <div>
        <div className="info-box">
          <h1>CLIENT DASHBOARD - external module</h1>
        </div>
        <div className="info-box">
          <h1>{client.name}</h1>
        </div>
        <div className="info-box">
          <h1>{client.surname}</h1>
        </div>
      </div>
      <div>
        <div className="info-box">
          <h1>{client.birthdate}</h1>
        </div>
        <div className="info-box">
          <h1>{client.address}</h1>
        </div>
        <div className="info-box">
          <h1>{client.city}</h1>
        </div>
        <div className="info-box">
          <h1>{client.postalCode}</h1>
        </div>
      </div>
    </div>
  );
}
