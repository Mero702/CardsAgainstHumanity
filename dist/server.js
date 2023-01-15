import Express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
config();
import GameManager from "./game/GameManager.js";
// TODO: implement socket.io middleware if they exist to check if game exist and maybe to execute and error handle the game functions.
// TODO: maybe create an update function
// TODO: split socket.io and express routes into different files
const app = Express();
const server = createServer(app);
const port = (process.env?.PORT || 3000);
global.__dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
global.gameManager = new GameManager();
if (process.env?.DEVELOPMENT) {
    console.log("Running in development mode");
    const cors = await import("cors");
    app.use(cors.default());
}
app.use(Express.json());
app.use("/", Express.static(__dirname + "/public"));
const ApiRouter = await import("./apiRouter.js");
app.use("/api", ApiRouter.default);
app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
const SocketIOOptions = process.env?.DEVELOPMENT
    ? {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"],
        },
    }
    : {};
const io = new Server(server, SocketIOOptions);
io.on("connection", (socket) => {
    socket.on("joinRoom", (room, username, callback) => {
        // rejects a client who is already participating in a room
        if ([...socket.rooms.keys()].some((x) => x.includes("room-")))
            return callback({
                ok: false,
                isHost: false,
                error: "User is already playing a CAH game",
            });
        let game = gameManager.findGame(room);
        if (!game)
            return callback({
                ok: false,
                isHost: false,
                error: `No game with the id "${room}" found`,
            });
        let playerStatus = game.addPlayer(socket.id, username);
        if (playerStatus.error)
            return callback({ ok: false, isHost: false, error: playerStatus.error });
        socket.data.username = username;
        socket.data.isHost = playerStatus.isHost;
        if (playerStatus.isHost)
            socket.join(`master`);
        socket.join(`room-${room}`);
        socket.data.room = room;
        io.to(`room-${room}`).emit("updateUsers", game.getPlayerInfos());
        return callback({ ok: true, isHost: socket.data.isHost || false });
    });
    socket.on("startGame", (callback) => {
        let game = gameManager.findGame(socket.data.room);
        if (!game)
            return callback({ ok: false, error: "No game found" });
        let error = game.startGame();
        game.players.forEach((p) => io
            .to(p.socketID)
            // @ts-ignore
            .emit("updateCards", p.cards, game.currentBlackCard, p.role));
        if (error)
            return callback({ ok: false, error });
        io.to(`room-${socket.data.room}`).emit("updatePhase", game.phase);
        io.to(`room-${socket.data.room}`).emit("updateUsers", game.players.map((x) => x.getInfo()));
        callback({ ok: true });
    });
    socket.on("submitAnswer", (cards, callback) => {
        let game = gameManager.findGame(socket.data.room);
        if (!game)
            return callback({
                ok: false,
                error: `No game with the id '${socket.data.room}' found`,
            });
        let error = game.submitAnswer(socket.id, cards, (votingPlayer, cards) => io.to(votingPlayer).emit("voting", cards));
        if (error)
            return callback({ ok: false, error });
        io.to(`room-${socket.data.room}`).emit("updatePhase", game.phase);
        io.to(`room-${socket.data.room}`).emit("updateUsers", game.players.map((x) => x.getInfo()));
        callback({ ok: true });
    });
    socket.on("submitVoting", (answerID, callback) => {
        let game = gameManager.findGame(socket.data.room);
        if (!game)
            return callback({
                ok: false,
                error: `No game with the id '${socket.data.room}' found`,
            });
        let error = game.submitVoting(socket.id, answerID, (winnerName, blackCard, answers, answerID) => io
            .to(`room-${socket.data.room}`)
            .emit("WinnerAnnouncement", winnerName, blackCard, answers, answerID));
        if (error)
            return callback({ ok: false, error });
        game.players.forEach((p) => {
            if (game && game.currentBlackCard)
                io.to(p.socketID).emit("updateCards", p.cards, game.currentBlackCard, p.role);
        });
        io.to(`room-${socket.data.room}`).emit("updateUsers", game.players.map((x) => x.getInfo()));
        io.to(`room-${socket.data.room}`).emit("updatePhase", game.phase);
    });
    socket.on("disconnect", () => {
        let game = gameManager.findGame(socket.data.room);
        if (!game)
            return;
        game.leaveRoom(socket.id);
        //@ts-ignore
        let votingPlayer = game.players.find((p) => p.role == "VOTING");
        if (votingPlayer)
            io.to(votingPlayer.socketID).emit("voting", game.answers);
        io.to(`room-${socket.data.room}`).emit("updateUsers", game.players.map((x) => x.getInfo()));
        io.to(`room-${socket.data.room}`).emit("updatePhase", game.phase);
        if (game.players.length == 0)
            gameManager.removeGame(game.uuid);
    });
});
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});
