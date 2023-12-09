import "./Sidebar.css";
import { FaPlusCircle } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { SlDocs } from "react-icons/sl";
import { FaHome } from "react-icons/fa";
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
          <Tooltip title="Create Course">
            <IconButton
              style={{
                fontSize: "1em",
                color: "black",
              }}
            >
              <FaPlusCircle />
            </IconButton>
          </Tooltip>
        </li>
        <li>
          <Tooltip title="Home">
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
        <li>
          <Tooltip title="Home">
            <IconButton
              style={{
                fontSize: "1em",
                color: "black",
              }}
            >
              <SlDocs />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
