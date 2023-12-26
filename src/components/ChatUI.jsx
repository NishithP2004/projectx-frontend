import "./ChatUI.css";
import { FaPaperPlane } from "react-icons/fa";

function ChatUI(props) {
  const socket = props.socket;

  const handleSubmit = (ev) => {
    ev.preventDefault();
    let form = document.forms[0];
    let msg = form["message"].value;
    let data = {
      msg,
      from: props.user.name,
      queryMultipleDocs: form["multipleDocs"].checked,
    };
    handleMessage(data);
    form["message"].value = "";
    console.log(msg);
    socket.emit(
      "message",
      {
        data,
        id: socket.id,
      },
      (data) => {
        handleMessage(data);
      },
    );
    form.reset();
    return true;
  };

  function handleMessage(data) {
    let chat = document.querySelector("#chat-container > ul");
    let li = document.createElement("li");
    li.innerHTML = `
<div class='bubble glass ${data.from !== "AI" ? "me" : "ai"}'>
    <p class='from'>${data.from}</p>
    <p class='msg'>${data.msg}</p> 
</div>
`;
    chat.appendChild(li);
    chat.scrollTo(0, chat.scrollHeight);
  }

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
          <ul id="chat-log"></ul>
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
