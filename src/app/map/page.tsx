import { Yurbo } from "@/types/types";
import MapboxMap from "../components/MapboxMap";
import { getErrorMessage } from "../constants/errors";

// todo: make the mapboxmap component take in marker props (your yurbos), then display these marker props

// works!
async function getYurbos() {
  console.log("getting yurbos");
  try {
    const res = await fetch("http://localhost:3000/api/yurbo/get");

    const result: { yurbos: Yurbo[] } = await res.json();

    return result.yurbos;
  } catch (e) {
    const errorMessage = getErrorMessage(e);
    console.log(errorMessage);
  }
}

export default async function Map() {
  let mapbox_token = process.env.MAPBOX_PUBLIC_TOKEN;

  const yurbos = await getYurbos();
  console.log("Yurboooos", yurbos);

  //   make sure types are correct
  if (mapbox_token === undefined) {
    console.log("Token is undefined ..");
    mapbox_token = "";
  }

  return (
    <div className="flex h-screen">
      <div
        className="w-1/2 h-screen pt-16"
        // style={{ maxHeight: "calc(100vh - 64px", overflowX: "scroll" }}
      >
        <ul>
          {yurbos?.map((y: Yurbo) => (
            <li>{y.location}</li>
          ))}
        </ul>
      </div>
      <div className="h-full w-1/2">
        <MapboxMap mapboxToken={mapbox_token} />
      </div>
    </div>
  );
}
