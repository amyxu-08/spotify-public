import "./ProfileBox.css";

export default function ProfileBox({ imageSrc, text, halfOpacity, onClick }) {
  return (
    <div className="profileBox" onClick={onClick}>
      <img src={imageSrc} className="profileBox-image" style={halfOpacity ? {opacity:'0.5'}:{opacity:'1'}} />
      <p className="profileBox-text" style={halfOpacity ? {opacity:'0.5'}:{opacity:'1'}}>{text}</p>
    </div>
  );
}
