import "./App.css";
import React from "react";
import { db } from "./firebase";

//Parent Component
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: [""],
      current_question: {
        question: "Loading...",
        correct_answer: "",
        possible_answers: [
          "Loading...",
          "Loading...",
          "Loading...",
          "Loading...",
        ],
      },
      question_num: 0,
      alive: true,
      result: "",
      user: "",
      logged: false,
      topScores: [""],
    };

    this.handleClick = this.handleClick.bind(this);
    this.setQuestions = this.setQuestions.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.handleUserSubmit = this.handleUserSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  //Send data to firebase
  async sendData() {
    await db
      .collection("usuarios")
      .doc()
      .set({
        usuario: this.state.user,
        score: this.state.question_num - 1,
      });
    console.log("The data was sent");

    let data = [];

    const snapshot = await db
      .collection("usuarios")
      .orderBy("score", "desc")
      .limit(5)
      .get();

    snapshot.forEach((e) => {
      data.push(e.data());
    });

    await this.setState({ topScores: data });
  }

  //When user clicks play, it logs
  handleUserSubmit() {
    this.setState({ logged: true });
  }
  //Update the username
  handleUserChange(e) {
    this.setState({ user: e.target.value });
  }

  //Snippet to scape special characters from JSON
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rsquo;/g,"'")
      .replace(/&Uuml;/g,"Ü");
  }

  //Set up the questions
  setQuestions() {
    this.setState((state) => ({
      question_num: state.question_num + 1,
      current_question: {
        question: this.escapeHtml(
          state.response[this.state.question_num + 1].question
        ),
        correct_answer: this.escapeHtml(
          state.response[this.state.question_num + 1].correct_answer
        ),
        possible_answers: [
          ...state.response[this.state.question_num + 1].incorrect_answers.map(
            (e) => this.escapeHtml(e)
          ),
        ]
          .concat(state.response[this.state.question_num + 1].correct_answer)
          .sort((a, b) => 0.5 - Math.random()),
      },
    }));
  }

  //Load up the questions from the API
  componentDidMount() {
    fetch("https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple")
      .then((response) => {
        return response.json();
      })
      .then((e) => {
        this.setState({ response: e["results"] });
      })
      .then((e) => {
        this.setQuestions();
      });
  }

  //Handle the user choosing an answer
  handleClick(e) {
    if (e.target.value === this.state.current_question.correct_answer) {
      this.setQuestions();
    } else {
      this.sendData();
      this.setState({ alive: false });
    }
  }

  //Play Again
  resetGame() {
    this.setState({
      response: [],
      current_question: {
        question: "Loading...",
        correct_answer: "",
        possible_answers: [
          "Loading...",
          "Loading...",
          "Loading...",
          "Loading...",
        ],
      },
      question_num: 0,
      alive: true,
      result: "",
      user: "",
      logged: false,
      topScores: [""],
    });

    fetch("https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple")
      .then((response) => {
        return response.json();
      })
      .then((e) => {
        this.setState({ response: e["results"] });
      })
      .then((e) => {
        this.setQuestions();
      });
  }

  //Render
  render() {
    if (!this.state.logged) {
      return (
        <div className="main">
          <form className="user">
            <label for="user">Enter your username:</label>
            <input
              onChange={this.handleUserChange}
              value={this.state.user}
              type="text"
              required
            />
            <button onClick={this.handleUserSubmit}> PLAY </button>
          </form>
        </div>
      );
    }

    if (this.state.alive) {
      return (
        <div className="main">
          <h1 className="question_title">{this.state.current_question.question}</h1>

          <div className="questions">
            <button
              onClick={this.handleClick}
              value={this.state.current_question.possible_answers[0]}
              id="1"
            >
              {this.state.current_question.possible_answers[0]}
            </button>
            <button
              onClick={this.handleClick}
              value={this.state.current_question.possible_answers[1]}
              id="2"
            >
              {this.state.current_question.possible_answers[1]}
            </button>
            <button
              onClick={this.handleClick}
              value={this.state.current_question.possible_answers[2]}
              id="3"
            >
              {this.state.current_question.possible_answers[2]}
            </button>
            <button
              onClick={this.handleClick}
              value={this.state.current_question.possible_answers[3]}
              id="4"
            >
              {this.state.current_question.possible_answers[3]}
            </button>
          </div>

          <p className="score">Score: <strong>{this.state.question_num - 1}</strong> </p>
        </div>
      );
    } else {
      const leaderBoard = this.state.topScores.map((e) => {
        return (
          <li>
            {e.usuario}: <strong>{e.score}</strong> 
          </li>
        );
      });

      return (
        <div className="main end">
          <h1>GAME OVER!!!</h1>
          <p>Final Score: <strong>{this.state.question_num - 1}</strong> </p>
          <h2>{this.state.current_question.question}</h2>
          <p>
            The correct answer was: <strong>{this.state.current_question.correct_answer}</strong> 
          </p>

          <h2>Highest scores: </h2>
          <ul className="leaderBoard">{leaderBoard}</ul>

          <button onClick={this.resetGame}>Play again</button>
        </div>
      );
    }
  }
}

//App that will be exported
function App() {
  return (
    <div className="App">
      <Main className="main" />
    </div>
  );
}

export default App;
