import "./Home.css";

function Home(props) {
  return (
    <div className="container glass">
      <h1 className="glass">{props.title}</h1>
      <div className="glass courses">
        <div className="course glass">
          <h2>Java Constructors</h2>
          <button className="view glass">View</button>
          <button className="delete glass">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
