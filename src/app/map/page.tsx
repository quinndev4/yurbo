import { Yurbo } from "@/types/types";
import MapboxMap from "../components/MapboxMap";
import { ERRORS, getErrorMessage } from "../constants/errors";

import { db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LOGS } from "@/app/constants/logs";

// todo: make the mapboxmap component take in marker props (your yurbos), then display these marker props

// extrapolated logic from api...
async function getYurbos() {
  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get yurbos for this user
    const yurbo_snapshot = await getDocs(
      query(
        collection(db, "users", session.user.email, "yurbos")
        // orderBy("timestamp", "desc")
      )
    );

    let yurbos: Yurbo[] = [];

    yurbo_snapshot.forEach((doc) => {
      yurbos.push(doc.data());
    });

    console.log(LOGS.YURBO.GOT, "for user", session.user.email, yurbos);
    return Response.json({ yurbos });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export default async function Map() {
  let mapbox_token = process.env.MAPBOX_PUBLIC_TOKEN;

  const res = await getYurbos();
  const data = await res.json(); // had to split these into two awaits
  const yurbos = data.yurbos;

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
