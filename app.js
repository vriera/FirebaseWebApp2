// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
const {initializeApp} = require('firebase/app');
//import { getDatabase , ref ,set } from "firebase/database";
const { getDatabase , ref ,set }= require('firebase/database');
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN91oCKdnLSn4Weic-opuS1-XusHNF_vw",
  authDomain: "test-aaf3e.firebaseapp.com",
  projectId: "test-aaf3e",
  storageBucket: "test-aaf3e.appspot.com",
  messagingSenderId: "44264918928",
  appId: "1:44264918928:web:0feb44558dc4334b32ed15",
  measurementId: "G-8Q00KDXPJS",
  databaseURL: "https://test-aaf3e-default-rtdb.firebaseio.com/",
  storageBucket: "gs://test-aaf3e.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//const analytics = getAnalytics(app);


async function writePatente(patenteId, data) {
    set(ref(database, 'patentes/' + patenteId), 
    data
    );
  }


//writePatente(sample[10] , sample  );

module.exports = {app , database , writePatente}
