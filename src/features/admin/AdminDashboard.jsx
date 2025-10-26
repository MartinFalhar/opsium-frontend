function AdminDashboard({ client }) {
  console.log("AdminDashboard - user:", client);
  return (
    <div>
      <div className="info-box">
        <h1>AdminDashboard - external module</h1>
      </div>
      <div>
        <h1>User ID: {client.id}</h1>
        <h1>User Name: {client.name}</h1>
        <h1>User Email: {client.email}</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
