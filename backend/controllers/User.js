const bcrypt = require ('bcrypt'); //plug in pour hasher les mdp
const User = require('../models/User');
const cryptojs = require('crypto-js');//module pour chiffrer l'email dans la BDD
const passwordValidation = require('password-validator')
const jwt = require('jsonwebtoken');
require('dotenv').config();

var schema = new passwordValidation();

schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


//Fonction qui va crypter le mdp + création d'un nouveau User avec ce mdp puis l'enregistre
exports.signup = (req, res, next) =>{
     if (!schema.validate(req.body.password)){
         return res.status(400).json({error:"mot de passe invalide"})
     }else if (schema.validate(req.body.password)){
        
        bcrypt.hash(req.body.password,10)
           .then(hash =>{
               const user = new User({
                   email: cryptojs.HmacSHA512(req.body.email, process.env.EMAIL_KEY).toString(),
                   password: hash
               });
               user.save()
               .then(()=> res.status(201).json({message : "utilisateur créé"}))
               .catch(error =>res.status(400).json({error}));
           })
           .catch(error =>res.status(500).json({error}));
       };
    };
   
//pour connecter de nouveaux utilisateurs
exports.login = (req, res, next) =>{
    const decryptEmail = cryptojs.HmacSHA512(req.body.email, process.env.EMAIL_KEY).toString();
    User.findOne({email: decryptEmail})//adress mail unique utilisateur pour qui l'adress mail correspond à l'adresse mail dans la req
        .then(user => {
            if(!user){
                return res.status(401).json({error: "utilisateur non trouvé"})
            }
            bcrypt.compare(req.body.password, user.password) // on compare le mdp envoyé par l'utilisateur avec celui qui est enregistré.
                .then(valid =>{ //ici on reçoit un boolean et donc si on reçoit false : mdp invalide
                    if (!valid){
                        return res.status(401).json({error:'mot de passe incorrect'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //on appel une fonction qui prend deux arguments : les données que l'on vont encoder (payload) et la clé secrete
                            {userId: user._id},
                            process.env.TOKEN_KEY,
                            {expiresIn:'24h'} //ici on encode l'user Id pour qu'il soit unique à l'utilisateur et éviter que d'autres puisse faire des modifs
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};