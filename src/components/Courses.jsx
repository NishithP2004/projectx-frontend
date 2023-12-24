import "./Courses.css";
import Section from "./Section";
import Layout from "./Layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

function Courses({ user, courses, setCourses }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      try {
        let data = await fetch("/api/courses/list", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET",
        }).then((res) => res.json());
        setCourses(data.courses);
      } catch (err) {
        if (err) console.log(err);
      }
    })();
  }, []);

  return (
    <Layout user={user}>
      <Section title="Courses">
        <div className="glass courses">
          {/* <div className="course glass">
            <h2>Java Constructors</h2>
            <button className="view glass">View</button>
            <button className="delete glass">Delete</button>
          </div> */}
          {courses.length > 0 ? (
            courses?.map((course) => {
              return (
                <div className="course glass" key={course.course.id}>
                  <h2>{course.course.name}</h2>
                  <button
                    className="view glass"
                    data-id={course.course.id}
                    onClick={(ev) => {
                      localStorage.setItem(
                        "course_id",
                        ev.currentTarget.getAttribute("data-id"),
                      );
                      navigate(
                        "/courses/" + ev.currentTarget.getAttribute("data-id"),
                      );
                    }}
                  >
                    View
                  </button>
                  <button className="delete glass" data-id={course.course.id}>
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <Box sx={{ width: "100%", height: "30%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          )}
        </div>
      </Section>
    </Layout>
  );
}

export default Courses;
