## Piquante

Le projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 7.0.2.

Pour faire fonctionner le projet, vous devez installer node-sass à part.

L'objectif du projet est de dévellopper le backend d'une application dans laquelle on pourra rajouter/enlever/modifier et liker des sauces.
Le Frontend est déjà fourni.

## Technologies:

* Serveur Node.js
* API REST
* Framework Express
* Base de donnée MongoDB

## Pré requis 
Pour lancer le projet, tapez npm install pour le Frontend ainsi que le back
Modules nécessaires : Mongoose , Bcrypt, Body-Parser, Express, Helmet, Multer, jsonwebtoken, crypto-js, mongoose-unique-validator, dotenv.

## Sécurité 

=> OWASP et RGPD

* Authentification avec les token grâce à __jsonwebtoken__

* Protection des headers et des xxs avec __Helmet__

* Cryptage des emails avec __crypto-js__

* Hashage du mot de passe avec __bcrypt__

* Vérification que l'email soit unique dans la BDD grâce à __mongoose-unique-validator__

* __Password validator__ qui force l'ultilisateur à avoir un certains nombre de caractère

* Protection des données sensibles grâce à __dotenv__

## Lancer l'application

* Frontend :
=> Démarrer `ng serve` pour avoir accès au serveur de développement. Rendez-vous sur `http://localhost:4200/`. L'application va se recharger automatiquement si vous modifiez un fichier source.

* Backend :
=> Démarrer node server.js 


NB:

*Ajoutez un fichier dans votre racine du backend nommé ".env". A l'intérieur, 3 variables d'environnement secrètes y sont définies:

**DB_CONNECTION = 'lien_vers_la_BDD_mongoDB'
**TOKEN_KEY = 'clé_secrète_pour_les_tokens'
**EMAIL_KEY = 'clé_secrète_emails'
