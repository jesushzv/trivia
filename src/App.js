import "./App.css";
import React from "react";

//Parent Component
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };

    this.handleClick = this.handleClick.bind(this);
    this.setQuestions = this.setQuestions.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  //Snippet to scape special characters from JSON
  escapeHtml(unsafe) {
  return unsafe
       .replace(/&amp;/g, "&")
       .replace(/&lt;/g, "<")
       .replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"')
       .replace(/&#039;/g, "'");
}

  //Set up the questions
  setQuestions() {
    this.setState((state) => ({
      question_num: state.question_num + 1,
      current_question: {
        question: this.escapeHtml(state.response[this.state.question_num + 1].question),
        correct_answer:
          this.escapeHtml(state.response[this.state.question_num + 1].correct_answer),
        possible_answers: [
          ...state.response[this.state.question_num + 1].incorrect_answers.map(e=>this.escapeHtml(e)),
        ]
          .concat(state.response[this.state.question_num + 1].correct_answer)
          .sort((a, b) => 0.5 - Math.random()),
      },
    }));
  }

  //Load up the questions from the API
  componentDidMount() {
    fetch("https://opentdb.com/api.php?amount=50&type=multiple")
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
      this.setState((state) => ({ result: "CORRECT" }));
      this.setQuestions();
    } else {
      this.setState({ result: "WRONG", alive: false });
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
    });

    fetch("https://opentdb.com/api.php?amount=50&type=multiple")
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

  render() {
    if (this.state.alive) {
      return (
        <div>
          <h1>{this.state.current_question.question}</h1>
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
          <h2>Score: {this.state.question_num - 1}</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h1>GAME OVER!!!</h1>
          <h2>Final Score: {this.state.question_num - 1}</h2>
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
      <Main />
    </div>
  );
}

export default App;
