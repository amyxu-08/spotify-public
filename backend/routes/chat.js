var express = require('express');
var router = express.Router();
const db = require("./firebase");
const {getDocs, collection, addDoc, updateDoc, deleteDoc,
    getFirestore,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,} = require("firebase/firestore");

// Gets the chat data from firebase
// Based on the user id that is requested, return chat that includes that user
router.get("/:name", async (req, res) => {
    // req.id must be a string of the user id 
    const reqName = req.params["name"]
    const allDocData = [];
    const filterData = []; 
    const docs = await getDocs(collection(db, "chats"));
    docs.forEach((doc) => allDocData.push(doc.data()));
    
    allDocData.forEach((info) => {
        if (info.people.includes(reqName)) {
            filterData.push(info)
        }
    })

    res.json({result: filterData});

})


module.exports = router;