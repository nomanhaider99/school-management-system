"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var user_routes_1 = require("./routes/user.routes");
var cookie_parser_1 = require("cookie-parser");
var database_1 = require("./config/database");
var app = (0, express_1.default)();
(0, dotenv_1.config)();
(0, database_1.connectDatabase)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/users', user_routes_1.default);
app.listen(process.env.PORT, function () {
    console.log("\uD83D\uDD78\uFE0F Server is Listening on Port ".concat(process.env.PORT));
});
