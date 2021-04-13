//app.js gère toute les requêtes envoyées au serveur.
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const path = require('path');
const sauceRoutes = require ('./routes/Sauce')
const userRoutes = require('./routes/User')
const app = express();
require ('dotenv/config');


mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => { // middleware appliqué à toutes les requêtes envoyés au serveur et permet d'accèder à l'application en éviter les erreurs CORSs
    res.setHeader('Access-Control-Allow-Origin', '*'); //origin autorisé = tout le monde
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //on donne l'autorisation d'utiliser certaines entêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/image', express.static(path.join(__dirname, 'image')));

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);


module.exports = app;