

// PASTE FIREBASE CONFIG HERE
const firebaseConfig = ""

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

signInBtn = document.getElementById('sign-in-btn')
signUpBtn = document.getElementById('sign-up-btn')

signUpBtn.addEventListener('click', (e) => {
    const email = document.querySelector('.login-wrapper #email').value
    const password = document.querySelector('.login-wrapper #password').value

    auth.createUserWithEmailAndPassword(email, password)
    .then(Credential => {
        console.log("Successfully signed up", Credential.user);
    }).catch(error => {
        console.log("error",error);
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
    });
})

auth.onAuthStateChanged(user =>{
    console.log("user info", user);
    if(user) {
        window.location = 'index.html'
    }
})


