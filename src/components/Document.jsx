import "./Document.css";
import Section from "./Section";
import Layout from "./Layout";
import ChatUI from "./ChatUI";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

function Document({ user, auth, socket, courses }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [content, setContent] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        let doc_id = courses?.filter(
          (course) => course.course.id == localStorage.getItem("course_id"),
        )[0].docs[0];

        await fetch(`/api/courses/documents/${doc_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((res) => setContent(res.content))
          .catch((err) => {
            if (err) throw err;
          });
      } catch (err) {
        console.error(err);
        enqueueSnackbar(`An error occured`, {
          variant: "error",
        });
        console.error(err);
      }
    })();
  }, []);

  return (
    <Layout user={user}>
      <Section title="Document Reader">
        <div
          classNme="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <MarkdownRenderer content={content} />
          <ChatUI user={user} auth={auth} socket={socket} />
        </div>
      </Section>
    </Layout>
  );
}

export default Document;
