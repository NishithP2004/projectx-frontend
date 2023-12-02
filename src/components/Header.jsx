import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <header className="glass">
      <h4>Project X</h4>
      <img
        src={props.user.img}
        alt="Open Profile"
        onClick={handleClick}
        style={{
          pointerEvents: "all",
          cursor: "pointer",
        }}
      />
    </header>
  );
}

export default Header;
