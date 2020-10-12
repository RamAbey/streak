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
        return ""
    })
    .then(x => {
        // eslint-disable-next-line promise/no-nesting
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
        return res.status(200).send("Updated sucessfully!")
    })
    .catch(err => {
        console.log('Error getting document', err)
        return res.status(200).send("Error", err)
    })
})

// exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 */6 * * *')
// .timeZone('America/New_York').onRun((context) => {
//     console.log("This will be run every 6 hours according to EST.");
//     return null;
// })