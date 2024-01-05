import "./ChatUI.css";
import { FaPaperPlane } from "react-icons/fa";
import { useRef, useEffect } from "react";

function ChatUI(props) {
  const socket = props.socket;
  const ref = useRef();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    let form = document.forms[document.forms.length - 1];
    let msg = form["message"].value;
    let data = {
      msg,
      from: props.user.name,
      queryMultipleDocs: form["multipleDocs"].checked,
      course: localStorage.getItem("course_id"),
      context: props.context ? props.context : null,
    };
    handleMessage(data);
    form["message"].value = "";
    console.log(msg);
    socket.emit(
      "message",
      {
        id: socket.id,
        token: sessionStorage.getItem("token"),
        data,
      },
      (data) => {
        handleMessage(data);
      },
    );
    form.reset();
    return true;
  };

  function handleMessage(data) {
    // let chat = document.getElementById("#chat-log");
    // let li = document.createElement("li");
    // li.innerHTML = `
    //   <div class='bubble glass ${data.from !== "AI" ? "me" : "ai"}'>
    //     <p class='from'>${data.from}</p>
    //     <p class='msg'>${data.msg}</p>
    //   </div>
    // `;
    props.setMessages((prevMessages) => [
      ...prevMessages,
      {
        from: data.from,
        message: data.msg,
        timestamp: new Date().getTime(),
        course: localStorage.getItem("course_id"),
      },
    ]);

    // ref.current.appendChild(li);
    // ref.current.scrollTo(0, ref.current.scrollHeight);
  }

  useEffect(() => {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [props.messages]);

  return (
    <main
      className="glass"
      id="chatUI"
      style={{
        width: "40%",
        height: "100%",
      }}
    >
      <div className="chat-container glass">
        <div id="chat-container">
          <ul id="chat-log" ref={ref}>
            {props.messages.length > 0
              ? props.messages
                  .filter(
                    (msg) => msg.course == localStorage.getItem("course_id"),
                  )
                  .map((msg, index) => {
                    return (
                      <li key={index}>
                        <div
                          className={`bubble glass ${
                            msg.from !== "AI" ? "me" : "ai"
                          }`}
                        >
                          <p className="from">{msg.from}</p>
                          <div
                            className="msg"
                            dangerouslySetInnerHTML={{ __html: msg.message }}
                          ></div>
                        </div>
                      </li>
                    );
                  })
              : ""}
          </ul>
        </div>
        <form
          id="chat"
          className="glass"
          name="chat"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <textarea
            required
            name="message"
            placeholder="Type in your message... "
            rows="1"
          ></textarea>
          <button type="submit" className="submit-button">
            <FaPaperPlane
              style={{
                fontSize: "1em",
              }}
            />
          </button>
          <div
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: "Lato, sans-serif",
            }}
          >
            <input type="checkbox" name="multipleDocs" id="multipleDocs" />
            &nbsp;
            <label
              htmlFor="multipleDocs"
              style={{
                fontSize: "0.9em",
              }}
            >
              Query Multiple documents?{" "}
            </label>
          </div>
        </form>
      </div>
      <p
        id="status"
        style={{
          textAlign: "center",
        }}
      ></p>
    </main>
  );
}

export default ChatUI;
