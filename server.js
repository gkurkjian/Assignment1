// npm init, npm install express, npm install nodemon, npm install cors, 
// npm install dotenv, npm install dotenv --save npm install mongoose, npm git init

/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __George_Kurkjian___ Student ID: ___137555207_____ Date: ___9-16-2022____
*  Cyclic Link: _______________https://good-teal-millipede-tutu.cyclic.app/__________________________
*
********************************************************************************/ 


// Setting up the server
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");

require('dotenv').config({path: "./keys.env"}); 
const { MONGODB_CONN_STRING } = process.env;

const db = new MoviesDB();
const app = express();

app.use(cors());
app.use(express.json());  // I guess I need body-parser middleware to run this
app.use(express.urlencoded({ extended: true }));  // yes I solved it with this!


const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json( { message: "API Listening"});
});

app.post('/api/movies', (req, res) => {
  if(Object.keys(req.body).length === 0) {
    res.status(500).json({ error: "Invalid number "});
  } else {
    db.addNewMovie(req.body).then((data) => { res.status(201).json(data)
    }).catch((err) => { res.status(500).json({ error: err }); });
  }
});

app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
      if (data.length === 0) res.status(204).json({ message: "No data returned"});  // 204 status code it's no content
      else res.status(201).json(data);  // 201 status code it's when is created
    }).catch((err) => {
      res.status(500).json({ error: err });  // 500 to show msg internal server error
    })
});

// this route to accepting a id
app.get('/api/movies/:_id', (req, res) => {
  db.getMovieById(req.params._id).then((data) => {
    res.status(201).json(data)  // when it accepts should be code status 201 that proved data has crated
  }).catch((err) => {
    res.status(500).json({ error: err });
  })
})

app.put('/api/movie/:_id', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(500).json({ error: "No data to update"});
    }
    const data = await db.updateMovieById(req.body, req.params._id);
    res.json({ success: "Movie updated!"});
  }catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/movies/:_id', async (req, res) => {
  db.deleteMovieById(req.params._id).then(() => {
    res.status(202).json({ message: `The ${req.params._id} removed from the system`})  // 202 status code accepted to delete the movie
    .catch((err) => {
      res.status(500).json({ error: err })
    })
  })
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});
