import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose"

dotenv.config()

const app = express();
const dbpass = process.env.DBPASS

mongoose.connect(dbpass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`listening on: ${process.env.PORT}`)
        })
        console.log('connected to database')
    })
    .catch((err) => {
        console.log(err)
    })