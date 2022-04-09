//router func = like a mini app


import express from 'express'


const app = express()





// middleware that is specific to this router


app.get("/bir", (req, res) => {

        res.send("birds");
});