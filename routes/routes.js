import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose"
import userSchema from '../models/userSchema.js'

dotenv.config()

const app = express();
app.use(express.json())

app.post('/createUser', (req, res) => {
    const createUser = new userSchema({
        bpUsername: req.body.bpUsername,
        discordId: req.body.discordId
    })

    createUser.save()
        .then((result) => {
            res.send(req.body)
        })
        .catch((err) => {
            res.send(req.body)
        })
})

app.post('/findDiscordAccount', (req, res) => {
    const findUserDiscord = userSchema.findOne({ 
        discordId: req.body.discordId
    }, (error, data) => {
        if (error) {
            console.log(data)
            res.send(error)
        } else {
            if (data === null) {
                res.status(200).send(false)
            } else {
                res.status(200).send(data)
            }
        }
    })

})

app.post('/findBpUsername', (req, res) => {
    const findUserDiscord = userSchema.findOne({ 
        bpUsername: req.body.bpUsername
    }, (error, data) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            if (data === null) {
                res.status(200).send(false)
            } else {
                res.status(200).send(data)
            }
        }
    })
})

app.post('/removeDiscordId', (req, res) => {
    const removeDiscordId = userSchema.deleteOne({
        discordId: req.body.discordId
    }, (error, data) => {
        if (error) {
            console.log(error)
            res.send(false)
        } else {
            console.log(data.deletedCount)
            if (data.deletedCount === 0){
                res.status(200).send(false)
            } else {
                res.status(200).send(true)
            }
        }
    })
})

export default app