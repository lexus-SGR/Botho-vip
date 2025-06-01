const boards = {}; // userId => board state

function printBoard(board) {
  return board.map(row => row.map(cell => cell || " ").join("|")).join("\n-+-+-\n");
}

export default {
  name: "tictactoe",
  description: "Cheza Tik-Tak-Toe na bot. Tumia !tictactoe start ili kuanza",
  category: "games",
  usage: "!tictactoe start|move <row> <col>",
  async execute(sock, msg) {
    const { from, body, key } = msg;
    const args = body.split(' ').slice(1);

    if (!args.length) return await sock.sendMessage(from, { text: "Tumia !tictactoe start kuanza au !tictactoe move <row> <col> kucheza." }, { quoted: msg });

    if (args[0] === "start") {
      boards[from] = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      await sock.sendMessage(from, { text: "Mchezo umeanzishwa! Wewe ni X. Tuma !tictactoe move <row> <col> kuanza kucheza." });
      await sock.sendMessage(from, { react: { text: "🎲", key } });
      return;
    }

    if (args[0] === "move") {
      if (!boards[from]) return await sock.sendMessage(from, { text: "Mchezo haujaanza. Tuma !tictactoe start kwanza." }, { quoted: msg });

      const row = parseInt(args[1]) - 1;
      const col = parseInt(args[2]) - 1;

      if (
        isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2
      ) {
        return await sock.sendMessage(from, { text: "Invalid move. Tumia namba 1-3 kwa row na col." }, { quoted: msg });
      }

      if (boards[from][row][col]) {
        return await sock.sendMessage(from, { text: "Hapo kuna alama tayari. Chagua sehemu nyingine." }, { quoted: msg });
      }

      // Player move
      boards[from][row][col] = "X";

      // Check player win
      if (checkWin(boards[from], "X")) {
        delete boards[from];
        await sock.sendMessage(from, { text: printBoard(boards[from]) + "\nUmeshinda! Hongera! 🎉" });
        await sock.sendMessage(from, { react: { text: "🏆", key } });
        return;
      }

      // Bot move (random)
      let botMoved = false;
      for (let i = 0; i < 3 && !botMoved; i++) {
        for (let j = 0; j < 3 && !botMoved; j++) {
          if (!boards[from][i][j]) {
            boards[from][i][j] = "O";
            botMoved = true;
            break;
          }
        }
      }

      // Check bot win
      if (checkWin(boards[from], "O")) {
        delete boards[from];
        await sock.sendMessage(from, { text: printBoard(boards[from]) + "\nBot ameshinda! 😢" });
        await sock.sendMessage(from, { react: { text: "😞", key } });
        return;
      }

      // Check draw
      if (isBoardFull(boards[from])) {
        delete boards[from];
        await sock.sendMessage(from, { text: printBoard(boards[from]) + "\nNi sare! 🤝" });
        await sock.sendMessage(from, { react: { text: "🤝", key } });
        return;
      }

      await sock.sendMessage(from, { text: printBoard(boards[from]) + "\nEndelea kucheza!" });
      await sock.sendMessage(from, { react: { text: "🎯", key } });
    }
  }
};

function checkWin(board, player) {
  // rows, cols, diags
  for (let i = 0; i < 3; i++) {
    if (board[i].every(c => c === player)) return true;
    if ([0, 1, 2].every(r => board[r][i] === player)) return true;
  }
  if ([0, 1, 2].every(i => board[i][i] === player)) return true;
  if ([0, 1, 2].every(i => board[i][2 - i] === player)) return true;
  return false;
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== null));
}
