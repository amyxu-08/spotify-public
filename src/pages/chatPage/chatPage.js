import "./chatPage.css";
// react
import { useState, useEffect } from "react";
// routing
import { RouteLocations } from "../../app/RouteLocations";
import { useNavigate, useParams } from "react-router-dom";
// firebase
import { auth, db } from "../../app/firebase";
// assets
import DefaultProfile from "../../assets/DefaultProfile.svg";
import thumbsup from "../../assets/thumbsup.svg";
import uparrow from "../../assets/uparrow.svg";
import music from "../../assets/music.svg";
import chatImage from "../../assets/chat.svg";
// axios
import axios from "axios";
// firebruh
import {
  collection,
  query,
  where,
  updateDoc,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
// components
import ProfileBox from "../../components/profileBox/ProfileBox";
import ChatBox from "./components/chatBox/ChatBox";

export default function ChatPage() {
  const navigate = useNavigate();
  const { name } = useParams();

  const [myChats, setMyChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [newChat, setNewChat] = useState("");

  const fetchChats = async () => {
    const q = query(
      collection(db, "chats"),
      where("people", "array-contains", auth.currentUser.displayName)
    );
    // only find that one chat that has auth.currentUser.displayName and name in the people field


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        // if (doc.data().people.includes(name) && doc.data().people.includes(auth.currentUser.displayName)) {
          chats.push(doc.data());
        // }
      });
      for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];
        const people = chat.people;
        const otherPerson =
          people[0] === auth.currentUser.displayName ? people[1] : people[0];
        chat.otherPerson = otherPerson;
      }
      setMyChats(chats);
      // set current chat to the chat that has the other person's name
      setCurrentChat(
        chats.find((chat) => chat.otherPerson === name)
      )
    });
    return () => {
      unsubscribe();
    }
    
  };

  // on snapshot listener to listen to the chat

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchChats();
      } else {
        console.log("User is logged out");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [name]);

  const sendNewMessage = async (message, sender) => {
    // update the firestore with the new sender and the new message
    const q = query(
      collection(db, "chats"),
      where("people", "array-contains", name)
    );
    // find the chat document that has the currentUser's name in it too
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().people.includes(auth.currentUser.displayName)) {
        updateDoc(doc.ref, {
          conversation: [...doc.data().conversation, { message, sender }],
        });
      }
    });

  };

  if (!auth.currentUser) {
    return <p>User is logged out</p>; // Handle the case when the user is logged out
  }

  return (
    <div className="chatPage">
      <section className="chatPage-left">
        <div className="chatPage-left-image">
          {auth.currentUser ? (
            <img
              src={auth.currentUser.photoURL}
              className="chatPage-left-image-img"
            />
          ) : (
            <img src={DefaultProfile} className="chatPage-left-image-img" />
          )}
        </div>
        <div className="chatPage-left-info">
          <p className="chatPage-left-info-name">
            {auth.currentUser ? auth.currentUser.displayName : "Not logged in"}
          </p>
          {/* <p className="chatPage-left-info-email">
            {auth.currentUser ? auth.currentUser.email : "Not logged in"}
          </p> */}
        </div>
        <div className="chatPage-left-buttons">
          {/* map over your chats to list all of the chats you have */}
          {myChats &&
            myChats.map((chat) => (
              <ProfileBox
                key={chat.id} // Assuming chat has a unique identifier or something
                text={chat.otherPerson}
                imageSrc={chatImage}
                halfOpacity={chat.otherPerson === name ? false : true}
                onClick={() => 
                  {
                    navigate(RouteLocations.chat + `/${chat.otherPerson}`)}
                    
                  } // put onclick here
              />
            ))}
        </div>
      </section>
      <section className="chatPage-right">
        <div className="chatPage-right-headerChatsWrapper">
          <h1 className="chatPage-right-header">
            You are now chatting with {name}
          </h1>
          {currentChat &&
            currentChat.conversation.map((chat) => {
              return <ChatBox text={chat.message} sender={chat.sender} />;
            })}
        </div>
        <input
          className="chatPage-right-input"
          placeholder="Type a message..."
          value={newChat}
          onChange={(e) => setNewChat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendNewMessage(newChat, auth.currentUser.displayName);
              setNewChat("");
            }
          }}
        />
      </section>
    </div>
  );
}
