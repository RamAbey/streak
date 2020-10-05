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

signInBtn = document.getElementById('sign-in-btn')
signUpBtn = document.getElementById('sign-up-btn')

LoginErrorMsg = document.querySelector('.login-wrapper .error-msg')

signUpBtn.addEventListener('click', (e) => {
    const email = document.querySelector('.login-wrapper #email').value
    const password = document.querySelector('.login-wrapper #password').value

    auth.createUserWithEmailAndPassword(email, password)
    .then(Credential => {
        console.log("Successfully signed up", Credential.user);
    }).catch(error => {
        console.log("error",error);
        LoginErrorMsg.innerHTML = `${error.message}`
        LoginErrorMsg.style.display = 'block'
    });
})

signInBtn.addEventListener('click', (e) => {
    const email = document.querySelector('.login-wrapper #email').value
    const password = document.querySelector('.login-wrapper #password').value

    auth.signInWithEmailAndPassword(email,password)
    .then(Credential => {
      console.log("Logged In successfully", Credential);
    }).catch(error=>{
      console.log("error",error);
      LoginErrorMsg.innerHTML = `${error.message}`
      LoginErrorMsg.style.display = 'block'
    });
})

auth.onAuthStateChanged(user =>{
    console.log("user info", user);
    if(user) {
        window.location = 'index.html'
    }
})


