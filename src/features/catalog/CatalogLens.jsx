function CatalogLens({ client }) {
  console.log("CatalogLens - user:", client.name);
  return (
    <div>
      <div className="info-box">
        <h1>CatalogLens - external module</h1>
      </div>
    </div>
  );
}

export default CatalogLens;
