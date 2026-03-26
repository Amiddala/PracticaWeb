let tablero = [];
let COLS = 10;
let colorJugador = "";
let colorPC = "";
let turnoJugador = true;
let juegoActivo = false;

window.onload = () => {
  const guardado = localStorage.getItem("GameLabo3");
  if (guardado) cargarPartida();
};

function elegirColor(color) {
  colorJugador = color;
  colorPC = color === "azul" ? "rosa" : "azul";

  document
    .querySelectorAll(".color-btn")
    .forEach((b) => b.classList.remove("activo"));
  document.querySelector("." + color).classList.add("activo");

  document.getElementById("btn-iniciar").disabled = false;
}

function iniciarJuego() {
  const tam = parseInt(document.getElementById("input-tam").value);
  if (tam < 5 || tam > 50 || !colorJugador) return;

  COLS = tam;
  turnoJugador = true;
  juegoActivo = true;

  tablero = Array.from({ length: COLS }, () => new Array(COLS).fill(""));

  document.getElementById("btn-finalizar").disabled = false;

  guardar();
  renderTablero();
}

function cargarPartida() {
  const data = JSON.parse(localStorage.getItem("GameLabo3"));

  tablero = data.tablero;
  COLS = data.cols;
  colorJugador = data.colorJugador;
  colorPC = data.colorPC;
  turnoJugador = data.turnoJugador;
  juegoActivo = true;

  document.getElementById("btn-finalizar").disabled = false;

  renderTablero();
}

function finalizarJuego() {
  localStorage.removeItem("GameLabo3");
  tablero = [];
  juegoActivo = false;

  document.getElementById("tablero").innerHTML = "";
}

function renderTablero() {
  const el = document.getElementById("tablero");
  el.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  el.innerHTML = "";

  for (let f = 0; f < COLS; f++) {
    for (let c = 0; c < COLS; c++) {
      const celda = document.createElement("div");
      celda.className = "celda " + (tablero[f][c] || "");
      celda.onclick = () => clickCelda(f, c);
      el.appendChild(celda);
    }
  }
}

function clickCelda(f, c) {
  if (!juegoActivo || !turnoJugador) return;

  pintar(f, c, colorJugador);


  turnoJugador = false;
  guardar();
  renderTablero();

  setTimeout(turnoPC, 400);
}

function turnoPC() {
  if (!juegoActivo) return;

  let vacias = [];

  for (let f = 0; f < COLS; f++)
    for (let c = 0; c < COLS; c++)
      if (tablero[f][c] !== colorPC) vacias.push([f, c]);

  if (vacias.length === 0) return;

  let [f, c] = vacias[Math.floor(Math.random() * vacias.length)];

  pintar(f, c, colorPC);


  turnoJugador = true;
  guardar();
  renderTablero();
}

function pintar(f, c, color) {
  const dirs = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  dirs.forEach(([dx, dy]) => {
    let x = f + dx;
    let y = c + dy;

    if (x >= 0 && x < COLS && y >= 0 && y < COLS) {
      tablero[x][y] = color;
    }
  });
}

function guardar() {
  localStorage.setItem(
    "GameLabo3",
    JSON.stringify({
      tablero,
      cols: COLS,
      colorJugador,
      colorPC,
      turnoJugador,
    }),
  );
}
