const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

const state = {
  rounds: 3,
  turn: "player",
  tokens: {
    cpu: {
      name: "cpu",
      position: 1,
      rolls: [],
      html: `<div class="token token-cpu"></div>`
    },
    player: {
      name: "player",
      position: 1,
      rolls: [],
      html: `<div class="token token-player"></div>`
    }
  }
};

const switchTurn = async () => {
  state.turn = state.turn === "cpu" ? "player" : "cpu";
  $(".player-turn").innerText =
    state.turn.charAt(0).toUpperCase() + state.turn.slice(1);
};

const decreaseRounds = () => {
  state.rounds = state.rounds - 1;
  $(".rounds-left").innerText = state.rounds;
};

const getSpace = position => $(`[data-space-id="${position}"]`);

const addRoll = (token, rollValue) => {
  state.tokens[token.name] = {
    ...token,
    rolls: [...token.rolls, rollValue]
  };
};

const moveToken = async (tokenName, spaces) => {
  let token = state.tokens[tokenName];
  addRoll(token, spaces);
  for (let i = token.position; i < token.position + spaces; i++) {
    await advancePosition(tokenName);
  }
  await sleep(500);
  $(".roll-result").innerText = "";
};

const advancePosition = async tokenName => {
  let token = state.tokens[tokenName];
  state.tokens[tokenName] = {
    ...token,
    position: token.position + 1
  };
  $(`.token-${token.name}`).remove();
  let space = getSpace(state.tokens[tokenName].position);
  space.innerHTML += token.html;
  return sleep(300);
};

const rollDice = () => {
  return Math.floor(Math.random() * 6);
};

const cpuRoll = async () => {
  await takeTurn();
};

const takeTurn = async () => {
  const rollValue = rollDice();
  $(".roll-result").innerText = rollValue;
  await moveToken(state.turn, rollValue);
};

const calculateWinner = () => {
  if (state.tokens.player.position > state.tokens.cpu.position) {
    // player wins
    $(".game-message-title").innerText = "🎉 You Win! 🎉";
    $(".game-message-description").innerText = `${
      state.tokens.player.position
    } - ${state.tokens.cpu.position}`;
  } else {
    // cpu wins
    $(".game-message-title").innerText = "CPU Wins :(";
    $(".game-message-description").innerText = `${
      state.tokens.player.position
    } - ${state.tokens.cpu.position}`;
  }
  $(".game-message").style.display = "block";
};

const render = () => {
  $(".dice").onclick = async function(e) {
    e.target.disabled = true;
    await takeTurn();
    // check if corner space
    await sleep(500);
    await switchTurn();
    await sleep(800);
    await cpuRoll();
    await sleep(500);
    await switchTurn();
    decreaseRounds();
    if (state.rounds === 0) {
      calculateWinner();
    } else {
      e.target.removeAttribute("disabled");
    }
  };
};

render();
