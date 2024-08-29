const {initializeApp} = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyAVVvP5vdcHnOrM7AGhjdSNkAo6ykZR0y4",
    authDomain: "newexample-3db65.firebaseapp.com",
    projectId: "newexample-3db65",
    storageBucket: "newexample-3db65.appspot.com",
    messagingSenderId: "665666706551",
    appId: "1:665666706551:web:1d6ea8495f6a39bd113a72"
  };

const  app =  initializeApp(firebaseConfig);
module.exports = app;