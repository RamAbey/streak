const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.countValues = functions.https.onRequest((x) => {
    numCount = new Array(21).fill(0)
    admin.firestore.collection("users").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log(doc.data().numbers);
            numCount[doc.data().numbers[0]] ++;
            numCount[doc.data().numbers[1]] ++;
            numCount[doc.data().numbers[2]] ++;
        })
        return numCount
    }).then(numCount =>{        
        pointsGiven = []
        for (var i = 0; i < 21; i++){
            numCount[i] ? pointsGiven.push(i/numCount[i]) : pointsGiven.push(0)
        }
        // console.log(pointsGiven)
        admin.firestore.collection("totals").doc(new Date().toJSON().slice(0,10)).set({
            totals: numCount,
            points: pointsGiven
        })
        return true
        // console.log(numCount)
    }).catch(err => {return err})
    res.send("")
})