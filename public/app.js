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
const db = firebase.firestore()
let lockedNumbers = false;
let x,y,z;
auth.onAuthStateChanged(user =>{
    // console.log("user info", user);
    if(user) {
        if (firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime) {
            modal.style.display = "block"
        }
        db.collection('users').doc(user.uid).get().then(doc=>{
            if (!(doc.data().numbers[0] == 0 && doc.data().numbers[1] == 0 && doc.data().numbers[2] == 0)) {
                num1.value = doc.data().numbers[0];
                num2.value = doc.data().numbers[1];
                num3.value = doc.data().numbers[2];
                num1.readOnly = true;
                num2.readOnly = true;
                num3.readOnly = true;
                lockedNumbers = true
            }
            return null
        }).catch(err=> {console.log("Error getting user data: ", err)})

        renderTable()
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

var modal = document.getElementById('info-modal');
var infoBtn = document.querySelector('.info-btn')
var infoClose = document.getElementById("info-modal-close")
infoBtn.addEventListener('click', (e) => {modal.style.display = "block"})
infoClose.addEventListener('click', (e) => {modal.style.display = "none"} ) 
window.addEventListener('click', (e)=>{
    if (e.target == modal) {
        modal.style.display = "none"
    }
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
document.querySelector('.submit-btn').addEventListener('click', submitNums)

function showError(errorMsg = "Error: Please enter valid numbers.") {
    document.getElementById('error').innerText = errorMsg
    document.getElementById('error').style.display='block'
    setTimeout(hideError, 3000)
}
function hideError() {
    document.getElementById('error').style.display="none"
}
function verifyNumber(number) {
    number = parseInt(number, 10)
    if (number) {
        if (number > 0 && number < 21) {
            // console.log(`Your number is ${number}`)
            document.getElementById('error').style.display = 'none'
            return number
        } else {
            showError()
            // console.log("Not between 1 and 20.")
            return false
        }
    } else {
        showError()
        return false
    }
}
function submitNums() {
    if (lockedNumbers){
        showError("You can only enter numbers once a day.")
    } else {
        if (verifyNumber(num1.value)) {
            num1.value = verifyNumber(num1.value)
        } 
        else {num1.value = ''; return false}
        if (verifyNumber(num2.value)) {
            num2.value = verifyNumber(num2.value)
        } 
        else {num2.value = ''; return false}
        if (verifyNumber(num3.value)) {
            num3.value = verifyNumber(num3.value)
        } 
        else {num3.value = ''; return false}
        db.collection("users").doc(firebase.auth().currentUser.uid).update({
            numbers: [parseInt(num1.value, 10),parseInt(num2.value, 10),parseInt(num3.value,10)]
        })
        .then(function() {
            console.log("Document successfully written!");
            lockedNumbers = true
            num1.readOnly = true;
            num2.readOnly = true;
            num3.readOnly = true;
        })
        .catch(function(error) {
            console.log("Error writing document: ", error)
        })
    }
}

function renderTable() {
    var s = ""
    db.collection("scores").doc("ranking").get().then(function(doc) {
        for (player in doc.data()) {
            if (player && doc.data()[player]){
                s += `<tr><td>${player}</td><td>${doc.data()[player].name}</td><td>${doc.data()[player].score}</td></tr>`
                // console.log(player, doc.data()[player])
            }
        }
        return s
    }).then(s => {document.getElementById('rank-table-body').innerHTML = s; return null})
    .then(x => {
        db.collection("users").doc(firebase.auth().currentUser.uid).get().then((doc) => {
            document.getElementById('total-pts').innerHTML=`<span class="pos-change">${doc.data().score}</span>`;
            document.getElementById('rank-table-body').innerHTML += `<tr><td>You</td><td>${doc.data().name}</td><td>${doc.data().score}</td></tr>`
        })
    })
}
dayjs.extend(window.dayjs_plugin_timezone)
dayjs.extend(window.dayjs_plugin_utc)
function updateTimeTo() {
    var currentTime = dayjs.utc().startOf("minute").tz("America/New_York");
    var remainderHour = (5 - currentTime.hour() % 6)
    var remainderMin = (60 - currentTime.minute())
    if (remainderMin == 60) {
        remainderMin = 0;
        remainderHour ++;
    }
    
    var dateTime = dayjs(currentTime).add(remainderMin, "minutes").add(remainderHour, "hours").local().format("MMM DD, YYYY h:mm a");

    document.getElementById('timeToScoreUpdate').innerHTML = (remainderHour ? (remainderHour + " hours and ") : "") + (remainderMin ? (remainderMin + " minutes ") : "")
    document.getElementById('timeOfScoreUpdate').innerHTML = dateTime

    setTimeout(updateTimeTo, 60000)
}
updateTimeTo()