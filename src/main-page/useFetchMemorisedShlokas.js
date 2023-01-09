import { useState, useEffect } from "react";
import { defaultCurrentSelectedDetails, errorCode } from "./Constants";

const useFetchMemorisedShlokas = () => {
  const [memorisedShlokas, setMemorisedShlokas] = useState({});

  useEffect(() => {
    if(localStorage.getItem('savedShlokas') !== null) {
      setMemorisedShlokas(JSON.parse(localStorage.getItem('savedShlokas')));
    } else {
      defaultCurrentSelectedDetails.error = errorCode;
      setMemorisedShlokas(defaultCurrentSelectedDetails);
    }
    // const fetchHouse = async () => {
    //   try {
    //     const rsp = await fetch("http://localhost:8080/api/v1/shlokas");
    //     if (rsp.ok) {
    //       const memorisedShlokasResponse = await rsp.json();
    //       setMemorisedShlokas(memorisedShlokasResponse);
    //     } else {
    //       throw new Error("Something went wrong");
    //     }
    //   } catch (error) {
    //     console.error("Your existing list is not fetched");
    //     setMemorisedShlokas({ error: "Unable to fetch the existing shlokas!!" });
    //   }
    // };
    // fetchHouse();
  }, []);

  return memorisedShlokas;
};

export default useFetchMemorisedShlokas;
