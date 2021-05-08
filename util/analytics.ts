import firebase from "firebase";
import qs, { ParsedQs } from "qs";
import { useEffect } from "react";
require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDmsFQalvYtQ1JYjfA6a1Me5ZUEDOIa4jE",
    authDomain: "webbidevaus-analytics.firebaseapp.com",
    databaseURL: "https://webbidevaus-analytics.firebaseio.com",
    projectId: "webbidevaus-analytics",
  });
}

const db = firebase.firestore();

export const useHit = () => {
  useEffect(() => {
    hit(
      window.location.pathname,
      qs.parse(window.location.search.replace(/\?/, ""))
    );
  }, []);
};

const hit = (page: string, queryParams: ParsedQs) => {
  db.collection("hits").add({
    page,
    queryParams,
    timestamp: new Date(),
  });
};
