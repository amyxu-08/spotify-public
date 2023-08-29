const express = require("express");
const router = express.Router();
const db = require("./firebase");

const { getDocs, collection, addDoc } = require("firebase/firestore");

router.get("/info", async (req, res, next) => {
  const allDocData = [];
  //const allDocIds = []
  // console.log(req.query)  // shows the URL params (stuff after the ? in the URL)
  const docs = await getDocs(collection(db, "forums"));
  docs.forEach((doc) => {
    allDocData.push(doc.data());
    //allDocIds.push(doc.id)
  });
  res.json({ result: allDocData });
});

router.get("/infoIDs", async (req, res, next) => {
  //const allDocData = []
  const allDocIds = [];
  // console.log(req.query)  // shows the URL params (stuff after the ? in the URL)
  const docs = await getDocs(collection(db, "forums"));
  docs.forEach((doc) => {
    //allDocData.push(doc.data())
    allDocIds.push(doc.id);
  });
  res.json({ result: allDocIds });
});

router.get("/users", async (req, res, next) => {
  const allDocData = [];
  const docs = await getDocs(collection(db, "users"));
  docs.forEach((doc) => {
    allDocData.push(doc.data());
  });
  res.json({ result: allDocData });
});

router.get("/info/:id", async (req, res, next) => {
  console.log(req.params); // shows the path params (stuff after /info/)
  res.sendStatus(200); // say OK without sending data back
});

router.post("/post", async (req, res, next) => {
  /*console.log(req.body)*/
  const { title, text, topic, user, likes } = req.body;

  console.log(title);
  console.log(text);
  console.log(topic);
  console.log(user);
  console.log(likes);

  await addDoc(collection(db, "forums"), {
    title: title,
    text: text,
    topic: topic,
    user: user,
    likes: likes,
  });

  res.send("Received");
});

module.exports = router;
