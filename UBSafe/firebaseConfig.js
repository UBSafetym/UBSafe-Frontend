import * as firebase from 'firebase';
import 'firebase/firestore';


// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAmqSW01bK3HiI13OUk4zA6o4QQZot4eR8",
  authDomain: "ubsafe-a816e.firebaseapp.com",
  databaseURL: "https://ubsafe-a816e.firebaseio.com",
  projectId: "ubsafe-a816e",
  storageBucket: "ubsafe-a816e.appspot.com",
  messagingSenderId: "160002718260"
};

export const Firebase = firebase.initializeApp(firebaseConfig);
//authentication = firebase.auth();

/*db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});*/