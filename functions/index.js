const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();

const db = admin.firestore();

// Returns Hello World
exports.helloWorld = functions.https.onRequest((req,res) => {
    console.log("Hello, World")
    res.status(200).send('Hello, World!');
})

exports.countValues = functions.https.onRequest((req,res) => {
    var numCount = new Array(21).fill(0);
    db.collection("users").get().then(snapshot => {
        snapshot.forEach(doc => {
            numCount[doc.data().numbers[0]] ++
            numCount[doc.data().numbers[1]] ++
            numCount[doc.data().numbers[2]] ++
        })
        return numCount
    }).then(numCount => {
        pointsGiven = []
        for (var i = 0; i < 21; i++){
            numCount[i] ? pointsGiven.push(i/numCount[i]) : pointsGiven.push(0)
        }
        return pointsGiven
    }).then(pointsGiven => {
        db.collection("totals").doc(new Date().toJSON().slice(0,10)).set({
            totals: numCount,
            points: pointsGiven
        })
        return pointsGiven
    }).then(points => {
        // eslint-disable-next-line promise/no-nesting
        db.collection("users").get().then(snapshot => {
            snapshot.forEach(doc => {
                points_to_add = points[doc.data().numbers[0]] + points[doc.data().numbers[1]] + points[doc.data().numbers[2]]
                db.collection("users").doc(doc.id).update({
                    numbers: [0,0,0],
                    score: admin.firestore.FieldValue.increment(points_to_add)
                })
            })
            return ""
        })
        .catch(err => console.log("Error getting users",err))
        return res.status(200).send("Updated sucessfully ")
    })
    .catch(err => {
        console.log('Error getting document', err)
        return res.status(200).send("Error", err)
    })
})

exports.updateRanking = functions.https.onRequest((req,res) => {
    db.collection("users").orderBy("score", "desc").limit(5).get().then(snapshot => {
        rank = 0
        snapshot.forEach(doc => {
            rank++
            db.collection("scores").doc("ranking").update({
                [rank]: {score: doc.data().score, uid: doc.id, name: doc.data().name}
            })
        })
        return res.status(200).send("Success getting rankings")
    })
    .catch(err => {console.log("Error getting rankings: ", err)})
})


// Example Functions

// // https://firebase.google.com/docs/functions/schedule-functions
// exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     console.log("This will run every 5 minutes!");
//     return null;
// })
// exports.scheduledFunctionCrontab = functions.pubsub.schedule('5 11 * * *')
// .timeZone('America/New_York').onRun((context) => {
//     console.log("This will be run every day at 11:05 AM Eastern!");
//     return null;
// })

// // https://medium.com/codingthesmartway-com-blog/introduction-to-firebase-cloud-functions-c220613f0ef
// exports.newUserCreated = functions.auth.user().onCreate(event => {
//     console.log("User created: ", event.data.uid)
//     return null;
// })
// exports.userDeleted = functions.auth.user().onDelete(event => {
//     console.log("User deleted: ", event.data.uid)
//     return null;
// })