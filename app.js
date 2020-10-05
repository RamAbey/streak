// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDLGhKNFhqZpqE1gnVEBvZrxxJd9PMKN8Q",
    authDomain: "streakio.firebaseapp.com",
    databaseURL: "https://streakio.firebaseio.com",
    projectId: "streakio",
    storageBucket: "streakio.appspot.com",
    messagingSenderId: "245556748101",
    appId: "1:245556748101:web:808101e237bb0c400c282c",
    measurementId: "G-SETJXC9KR4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();

auth.onAuthStateChanged(user =>{
    console.log("user info", user);
    if(user) {
        // Handle user information
    } else {
        window.location = 'login.html'
    }
})

document.querySelector('header .sign-out-btn').addEventListener('click', () => {
    firebase.auth().signOut().then(function() {
        console.log("User signed out successfully.")
      }).catch(function(error) {
        console.log('Error occured while signing out.')
      });
})

var num1 = document.getElementById("num1");
var num2 = document.getElementById("num2");
var num3 = document.getElementById("num3");


num1.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})
num2.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})
num3.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})

function verifyNumber(number) {
    number = parseInt(number, 10)
    if (number) {
        if (number > 0 && number < 21) {
            console.log(`Your number is ${number}`)
            document.getElementById('error').style.display = 'none'
            return true
        } else {
            showError()
            console.log("Not between 1 and 20.")
            return false
        }
    } else {
        showError()
        return false
    }
}

function showError() {
    document.getElementById('error').style.display='block'
}