import MapboxMap from "../components/MapboxMap";

export default function Map() {
  let mapbox_token = process.env.MAPBOX_PUBLIC_TOKEN;

  //   make sure types are correct
  if (mapbox_token === undefined) {
    console.log("Token is undefined ..");
    mapbox_token = "";
  }

  return (
    <div className="flex">
      <div
        className="w-1/2 h-screen pt-16"
        // style={{ maxHeight: "calc(100vh - 64px", overflowX: "scroll" }}
      >
        Probably a list of your yurbos . . .
      </div>
      <div className="inline-flex min-w-[600px]">
        <MapboxMap mapboxToken={mapbox_token} />
      </div>
    </div>
  );
}
