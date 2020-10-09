const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp();

exports.countValues = functions.firestore.collection("users").get()
    .then(function(querySnapshot) {
        numCount = new Array(21).fill(0)
        querySnapshot.forEach(function(doc) {
            numCount[doc.data().numbers[0]] ++
            numCount[doc.data().numbers[1]] ++
            numCount[doc.data().numbers[2]] ++
        })
    })