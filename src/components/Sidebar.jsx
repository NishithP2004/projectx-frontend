import "./Sidebar.css";
import { FaPlusCircle } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { SlDocs } from "react-icons/sl";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="glass">
      <ul>
        <li onClick={() => navigate("/courses")}>
          <FaHome />
        </li>
        <li onClick={() => navigate("/courses/create")}>
          <FaPlusCircle />
        </li>
        <li>
          <SiGoogledocs />
        </li>
        <li>
          <SlDocs />
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
