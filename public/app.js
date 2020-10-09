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

auth.onAuthStateChanged(user =>{
    // console.log("user info", user);
    if(user) {
        // countValues()
        updateScores()
        // updateRanking()
        // renderTable()
        // renderScoreBoard()
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

function showError() {
    document.getElementById('error').style.display='block'
}

document.querySelector('.submit-btn').addEventListener('click', submitNums)

function submitNums() {
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
    })
    .catch(function(error) {
        console.log("Error writing document: ", error)
    })
}

function countValues() {
    numCount = new Array(21).fill(0)
    db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.data().numbers)
            numCount[doc.data().numbers[0]] ++
            numCount[doc.data().numbers[1]] ++
            numCount[doc.data().numbers[2]] ++
        })
        return numCount
    }).then(numCount =>{        
        pointsGiven = []
        for (var i = 0; i < 21; i++){
            numCount[i] ? pointsGiven.push(i/numCount[i]) : pointsGiven.push(0)
        }
        // console.log(pointsGiven)
        db.collection("totals").doc(new Date().toJSON().slice(0,10)).set({
            totals: numCount,
            points: pointsGiven
        })
        // console.log(numCount)
    })
}
function updateScores() {
    db.collection("totals").doc(new Date().toJSON().slice(0,10)).get().then(function(doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            return doc.data().points
        } else {
            console.log("Document doesn't exist");
        }
    })
    .then(points => {
        db.collection("users").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                points_to_add = points[doc.data().numbers[0]] + points[doc.data().numbers[1]] + points[doc.data().numbers[2]]
                db.collection("users").doc(doc.id).update({
                    numbers: [0,0,0],
                    score: firebase.firestore.FieldValue.increment(points_to_add)
                })
            })
        })
    })
    .catch(function(error) {
        console.log("Error updating scores:", error);
    });
}
function updateRanking() {
    db.collection("users").orderBy("score","desc").limit(5).get()
    .then(function(querySnapshot) {
        rank = 0
        querySnapshot.forEach(function(doc) {
            rank++
            db.collection("scores").doc("ranking").update({
                [rank]: {score: doc.data().score, uid: doc.id, name: doc.data().name},
            })
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
}
function renderTable() {
    var s = ""
    db.collection("scores").doc("ranking").get().then(function(doc) {
        for (player in doc.data()) {
            if (player && doc.data()[player]){
                s += `<tr><td>${player}</td><td>${doc.data()[player].name}</td><td>${doc.data()[player].score}</td></tr>`
                console.log(player, doc.data()[player])
            }
        }
        return s
    }).then(s => document.getElementById('rank-table-body').innerHTML = s)
}
function renderScoreBoard() {
    db.collection("users").doc(firebase.auth().currentUser.uid).get()
    .then((doc) => {document.getElementById('total-pts').innerHTML=`<span class="pos-change">${doc.data().score}</span>`})
}