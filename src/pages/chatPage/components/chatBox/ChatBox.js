import "./ChatBox.css";
import {auth} from '../../../../app/firebase';
export default function ChatBox({ text, sender,}) {
  
  return (
    <div className="chatBox" style={auth.currentUser.displayName === sender ? {alignSelf: 'flex-end'}:{alignSelf:'flex-start', backgroundColor:'var(--light-green)', border:'1px solid transparent'}}>
      {/* <img src={profilePic} alt="profile pic" className="chatBox-profilePic" /> */}
      <p className="chatBox-text" style={auth.currentUser.displayName === sender ? {}: {color:'var(--cream)'}}>{text}</p>

    </div>
  );
}
