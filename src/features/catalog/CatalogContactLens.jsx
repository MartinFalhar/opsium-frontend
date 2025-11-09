function CatalogContactLens({ client }) {
  console.log("CatalogContactLens - user:", client.name);
  return (
    <div>
      <div className="info-box">
        <h1>CatalogContactLens - external module</h1>
      </div>
    </div>
  );
}

export default CatalogContactLens;
