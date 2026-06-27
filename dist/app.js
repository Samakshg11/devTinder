"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const request_1 = __importDefault(require("./routes/request"));
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./utils/socket"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost", "https://devtinder.site", "http://devtinder.site"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api", auth_1.default);
app.use("/api", profile_1.default);
app.use("/api", request_1.default);
app.use("/api", user_1.default);
app.use("/api", chat_1.default);
const server = http_1.default.createServer(app);
(0, socket_1.default)(server);
(0, database_1.default)().then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
        console.log("The server is successfully listening");
    });
})
    .catch((err) => {
    console.error("Database connection failed:", err.message);
});
