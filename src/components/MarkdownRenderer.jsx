import "./MarkdownRenderer.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function MarkdownRenderer(props) {
  return (
    <div className="glass" id="markdown-container">
      <Markdown remarkPlugins={[[remarkGfm, rehypeRaw]]}>
        {props.content || "Loading..."}
      </Markdown>
    </div>
  );
}

export default MarkdownRenderer;
