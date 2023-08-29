var express = require("express");
var router = express.Router();
const db = require("./firebase");
const { getDocs, collection } = require("firebase/firestore");

router.get("/", async (req, res, next) => {
  const allDocData = [];
  const docs = await getDocs(collection(db, "users"));
  docs.forEach((doc) => allDocData.push(doc.data()));
  res.json({ result: allDocData });
});

module.exports = router;
