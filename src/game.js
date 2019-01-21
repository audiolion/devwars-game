const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

const CORNER_POSITIONS = [0, 4, 8, 12];

const state = {
  rounds: 3,
  turn: "player",
  tokens: {
    cpu: {
      name: "cpu",
      position: 0,
      rolls: [],
      html: `<div class="token token-cpu"></div>`
    },
    player: {
      name: "player",
      position: 0,
      rolls: [],
      html: `<div class="token token-player"></div>`
    }
  }
};

const switchTurn = async () => {
  if (state.turn === "cpu") {
    state.turn = "player";
    $(".player-turn").innerText = "Player";
  } else {
    state.turn = "cpu";
    $(".player-turn").innerText = "CPU";
  }
};

const decreaseRounds = () => {
  state.rounds = state.rounds - 1;
  $(".rounds-left").innerText = state.rounds;
};

const getSpace = position => $(`[data-space-id="${position + 1}"]`);

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
    position: (token.position + 1) % 16
  };
  $(`.token-${token.name}`).remove();
  let space = getSpace(state.tokens[tokenName].position);
  space.innerHTML += token.html;
  return sleep(300);
};

const rollDice = () => {
  return Math.ceil(Math.random() * 6);
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
    $(".game-message").style.display = "none";
    await takeTurn();
    if (CORNER_POSITIONS.includes(state.tokens.player.position)) {
      e.target.removeAttribute("disabled");
      $(".game-message").style.display = "block";
      return;
    }
    await sleep(500);
    await switchTurn();
    await sleep(800);
    await cpuRoll();
    await sleep(500);
    while (CORNER_POSITIONS.includes(state.tokens.cpu.position)) {
      $(".game-message-description").innerText = "CPU gets an extra roll";
      $(".game-message").style.display = "block";
      await cpuRoll();
    }
    $(".game-message-description").innerText = "Player gets an extra roll";
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
