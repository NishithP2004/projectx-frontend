import "./Sidebar.css";
import { FaPlusCircle } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { SlDocs } from "react-icons/sl";
import { FaHome } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="glass">
      <ul>
        <li onClick={() => navigate("/courses")}>
          <Tooltip title="Home">
            <IconButton
              style={{
                fontSize: "1em",
                color: "black",
              }}
            >
              <FaHome />
            </IconButton>
          </Tooltip>
        </li>
        <li onClick={() => navigate("/courses/create")}>
          <Tooltip title="Create a Course">
            <IconButton
              style={{
                fontSize: "1em",
                color: "brown",
              }}
            >
              <FaPlusCircle />
            </IconButton>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            let course_id = localStorage.getItem("course_id");
            course_id ? navigate("/courses/" + course_id) : "";
          }}
        >
          <Tooltip title="Document Reader">
            <IconButton
              style={{
                fontSize: "1em",
                color: "black",
              }}
            >
              <SiGoogledocs />
            </IconButton>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            let course_id = localStorage.getItem("course_id");
            course_id ? navigate("/courses/references/" + course_id) : "";
          }}
        >
          <Tooltip title="References">
            <IconButton
              style={{
                fontSize: "1em",
                color: "black",
              }}
            >
              <FaGlobeAmericas />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
