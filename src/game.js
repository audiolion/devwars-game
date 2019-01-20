const $ = document.querySelector.bind(document);
const $$ = selector => Array.from(document.querySelectorAll(selector));

const sleep = time => new Promise(r => setTimeout(r, time));

const createState = () => ({
  players: [
    {
      user: "user",
      name: "red",
      place: 0,
      rolls: 3
    },
    {
      user: "cpu",
      name: "blue",
      place: 0,
      rolls: 3
    }
  ],
  currentPlayer: 0
});

let state = createState();

const reset = () => {
  state = createState();
  render(state);
};

const getSquare = index => {
  const squares = $$(".space");
  const place = (index % squares.length) + 1;
  return $('[data-index="' + place + '"]');
};

const rollDice = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const nextPlayer = async state => {
  state.currentPlayer++;
  if (state.players[state.currentPlayer] === undefined) {
    state.currentPlayer = 0;
  }

  if (state.players[state.currentPlayer].user === "cpu") {
    await sleep(300);
    const rolled = rollDice();
    handleMove(state, rolled);
  }
};

const render = state => {
  $$(".space").forEach(space => (space.innerHTML = ""));

  $(".turns-left").textContent = state.players[0].rolls;

  for (const player of state.players) {
    const square = getSquare(player.place);

    const element = document.createElement("div");
    element.className = "player " + player.name;

    square.appendChild(element);
  }
};

const handleMove = async (state, roll) => {
  const currentPlayer = state.players[state.currentPlayer];

  currentPlayer.rolls--;

  $(".number").textContent = roll;

  for (let i = 0; i < roll; i++) {
    currentPlayer.place++;

    render(state);

    console.log("render", currentPlayer.place);

    await sleep(300);
  }

  if ([0, 4, 8, 12].includes(currentPlayer.place % $$(".square").length)) {
    currentPlayer.rolls++;
  }

  $(".turns-left").textContent = state.players[0].rolls;

  $(".number").textContent = "";

  nextPlayer(state);

  $(".move").disabled = state.players[state.currentPlayer].user === "cpu";

  if (state.players.every(player => player.rolls <= 0)) {
    // screw doing it the nice way
    const tie = state.players[0].place === state.players[1].place;
    const winnerIsPlayer = state.players[0].place > state.players[1].place;

    $(".winning-result").style.display = "block";
    $(".winner").textContent = tie
      ? "TIE!"
      : winnerIsPlayer
      ? "Player wins!"
      : "You lose, suckah";

    $(".move").disabled = true;
  }
};

// who adds the script in the header nowadays anyways
// wtf
document.addEventListener("DOMContentLoaded", () => {
  render(state);

  $(".move").addEventListener("click", async () => {
    const currentPlayer = state.players[state.currentPlayer];

    if (currentPlayer.user !== "cpu") {
      const rolled = rollDice();
      handleMove(state, rolled);
    } else {
      alert("Not yo turn");
    }
  });

  $(".move").disabled = state.players[state.currentPlayer].user === "cpu";
});
