// const express = require("express");
import * as express from 'express';
import * as mongoose from 'mongoose';
import appRouter from './routes';
// const mongoose = require("mongoose");
// const Router = require("./routes");

const app = express();

app.use(express.json());

const username: string = 'bwang';
const password: string = 'MRbw%40%23%21105';
const cluster: string = 'cluster0.yedxv';
const dbname: string = 'myFirstDatabase';
const mongoDBConnectionInstance: string = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(`mongodb+srv://bwang:${password}@cluster0.yedxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db: mongoose.Connection = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected successfully');
});

app.use(appRouter);

app.listen(11146, () => {
    console.log('Server is running at port 11146');
});