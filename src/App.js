import React, { useState } from "react";
import {
  Link,
  Switch,
  Route,
  useParams,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import useField from "./hooks/useField";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link href="#" style={padding} to="">
        anecdotes
      </Link>
      <Link href="#" style={padding} to="/create">
        create new
      </Link>
      <Link href="#" style={padding} to="/about">
        about
      </Link>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      
        {anecdotes.map((anecdote) => (
          <li>
          <Link key={anecdote.id} to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
          </li>
        ))}
      
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for{" "}
    <a href="https://courses.helsinki.fi/fi/tkt21009">
      Full Stack -websovelluskehitys
    </a>
    . See{" "}
    <a href="https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

const CreateNew = (props) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [info, setInfo] = useState("");

  const history = useHistory();

  const contentField = useField('text'); 
  const authorField = useField('text');
  const infotField = useField('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: contentField.fieldParams.value,
      info: infotField.fieldParams.value,
      author: authorField.fieldParams.value,
      votes: 0,
    });
    history.push("/");
  };

  const resetHandler = () => {
    contentField.reset()
    authorField.reset()
    infotField.reset()
  }
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            name="content"
            { ...contentField.fieldParams }
          />
        </div>
        <div>
          author
          <input
            name="author"
            { ...authorField.fieldParams }
          />
        </div>
        <div>
          url for more info
          <input
            name="info"
           { ...infotField.fieldParams }
          />
        </div>
        <button>create</button>
      </form>
      <button onClick={resetHandler}>reset</button>
    </div>
  );
};

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{`has ${note.votes} votes`}</div>
    </div>
  );
};

const App = () => {
  const match = useRouteMatch("/anecdotes/:id");
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: "1",
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: "2",
    },
  ]);

  const [notification, setNotification] = useState(null);

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`a new anecdote ${anecdote.content} created!`);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const matchedNoted = match ? anecdoteById(match.params.id) : null;

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <p> {notification ? notification : null}</p>
      <Switch>
        <Route path="/create">
          <CreateNew addNew={addNew} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/anecdotes/:id">
          <Note note={matchedNoted} />
        </Route>
        <Route path="/">
          <AnecdoteList anecdotes={anecdotes} />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
