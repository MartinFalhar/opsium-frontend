function SuperadminDashboard({ userData }) {
  return (
    <div className="info-box">
      <h1>SuperadminDashboard - external module</h1>
      <h2>Organization: {userData.organization}</h2>
    </div>
  );
}

export default SuperadminDashboard;
