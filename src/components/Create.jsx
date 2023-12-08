import "./Create.css";
import Layout from "./Layout";
import Section from "./Section";
import { useEffect } from 'react';

function Create(props) {
    useEffect(() => {
        document.forms[0].addEventListener('submit', (ev) => {
            ev.preventDefault();
            console.log("Form Submitted")
            console.log(document.forms[0].course_name.value)
        })
    }, [])
  return (
    <Layout user={props.user}>
      <Section title="Create Course">
        <div
          className="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <form
            id="create-course"
            className="glass"
            action="/api/courses/create"
            method="POST"
          >
            <label htmlFor="course_name">Course Name</label>
            <input
              type="text"
              className="glass"
              name="course_name"
              id="course_name"
              required
              placeholder="DBMS Normalisation"
            />
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              className="glass"
              name="file"
              id="file"
              required
            />
            <div className="row" style={{
              flexWrap: "wrap"
            }}>
              <button type="submit" className="glass">
                Submit
              </button>
              <button type="reset" className="glass">
                Reset
              </button>
            </div>
          </form>
        </div>
      </Section>
    </Layout>
  );
}

export default Create;
