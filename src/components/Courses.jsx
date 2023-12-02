import "./Courses.css";
import Home from "./Home";
import Layout from "./Layout";

function Courses(props) {
  return (
    <Layout user={props.user}>
      <Home title="Courses" />
    </Layout>
  );
}

export default Courses;
