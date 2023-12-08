import "./Courses.css";
import Section from "./Section";
import Layout from "./Layout";
import { useEffect, useState } from 'react';

function Courses(props) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    (async function() {
      try {
        let data = await fetch("/api/courses/list", {
          headers: {
            'Authorization': `bearer ${sessionStorage.getItem("token")}`
          },
          method: "GET"
        })
        .then(res => res.json())
        setCourses(data.courses)
      } catch(err) {
        if(err)
          console.log(err)
      }
    })();
  }, [])

  return (
    <Layout user={props.user}>
      <Section title="Courses">
        <div className="glass courses">
        <div className="course glass">
            <h2>Java Constructors</h2>
            <button className="view glass">View</button>
            <button className="delete glass">Delete</button>
          </div>
          { courses?.map(course => {
            <div className="course glass">
            <h2>{course.name}</h2>
            <button className="view glass">View</button>
            <button className="delete glass">Delete</button>
          </div>
          })
         }
        </div>
      </Section>
    </Layout>
  );
}

export default Courses;
