const express = require('express');
const { notFound, serverError } = require('./errors_handlers/mainHandlers');
const mainRouter = require('./routers/mainRouter');

const app = express();
app.use(express.json());

app.use(mainRouter)//routers

app.use(notFound)
app.use(serverError)

module.exports = app
