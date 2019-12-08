const { stdin, stdout, exit } = process;
const questionList = require("./questions.json");

const displayQuestion = function(questionList, questionNo) {
  console.log(questionList[questionNo].question);
};

const isCorrectAnswer = function(userAns, questionList, qNo) {
  return +questionList[qNo].answer == userAns;
};

const timer = function() {
  return setTimeout(() => {
    console.log("Time Out");
    stdin.emit("data");
  }, 5000);
};

const getStatusAndScore = function() {
  let score = 0;
  return function(questionNo, userAnswer) {
    let message = `Incorrect Answer\t Score: ${score}`;
    if (isCorrectAnswer(userAnswer, questionList, questionNo)) {
      message = `Correct Answer\t Score: ${++score}`;
    }
    console.log(message);
    return score;
  };
};

process.on("exit", score =>
  console.log(`Final Score ... ${score}\nQuiz Over!!!!`)
);

const checkUserAnswer = function(questionList, timerId) {
  let questionNo = 0;
  let getScore = getStatusAndScore();
  return function(userAnswer) {
    let currentScore = 0;
    if (userAnswer) {
      currentScore = getScore(questionNo, userAnswer);
      clearTimeout(timerId);
    }
    if (questionNo < questionList.length - 1) {
      displayQuestion(questionList, ++questionNo);
      timerId = timer();
    } else {
      exit(currentScore);
    }
  };
};

const main = function() {
  displayQuestion(questionList, 0);
  const timerId = timer();
  const validateAns = checkUserAnswer(questionList, timerId);
  stdin.on("data", validateAns);
};

main(questionList);
