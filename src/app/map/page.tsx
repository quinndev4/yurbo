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

// extrapolated logic from api... need to fix caching
async function getYurbos() {
  // Type guard function (know if this is right!)
  function isYurbo(y: any): y is Yurbo {
    return (
      y && "lat" in y && "long" in y && "location" in y && "created_at" in y
    );
  }
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

    // populate yurbos array. Not sure whats the best way to do type stuff but i tried
    yurbo_snapshot.forEach((doc) => {
      const y = doc.data();
      // ensure data exists && is a Yurbo before pushing
      if (isYurbo(y)) {
        yurbos.push(y);
      } else {
        console.error("A datum does not conform to Yurbo interface:", y);
      }
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
        className="w-1/2 h-screen pt-16 ml-5"
        // style={{ maxHeight: "calc(100vh - 64px", overflowX: "scroll" }}
      >
        <h2 className="font-bold text-lg">Your Yurbos</h2>
        <ul>
          {yurbos?.map((y: Yurbo) => (
            <li>{y.location}</li>
          ))}
        </ul>
      </div>
      <div className="h-full w-1/2">
        <MapboxMap mapboxToken={mapbox_token} yurbos={yurbos} />
      </div>
    </div>
  );
}
