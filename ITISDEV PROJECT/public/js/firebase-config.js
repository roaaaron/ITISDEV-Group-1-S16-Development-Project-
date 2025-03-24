// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJtEuQrsUi-QR4iuVnvE3SSF6qwwL-02M",
  authDomain: "itssdlc-a2c5e.firebaseapp.com",
  databaseURL: "https://itssdlc-a2c5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itssdlc-a2c5e",
  storageBucket: "itssdlc-a2c5e.firebasestorage.app",
  messagingSenderId: "952595134127",
  appId: "1:952595134127:web:b337d807d479a375c1465a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize reCAPTCHA for MFA
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
  size: "invisible",
  callback: (response) => {
      console.log("reCAPTCHA verified!", response);
  },
  "expired-callback": () => {
      console.log("reCAPTCHA expired. Refreshing...");
  }
});