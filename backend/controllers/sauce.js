const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse (req.body.sauce);//on crée un object javascript (chaine de charactère pour l'image crée dans le corps de la requête)
    delete sauceObject.id; //l'app front va renvoyer une mauvaise id donc on le supp
    const sauce = new Sauce({
        ...sauceObject, //l'utilisation du spread permet de réutiliser les champs qu'il y a dans le body de la request. (instance du modèle)
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,//le frontend ne connais pas l'url car généré par Multer donc création de celle-ci
        likes : 0,
        dislikes : 0,
        usersLiked: [],
        usersDisliked: [],

 });
 sauce.save() //on va invoquer sa méthode pour enregistrer cet objet dans la base
    .then(() => res.status(201).json({message :"objet enregistré !"})) //on retourne une promesse dans laquelle on doit renvoyer une réponse pour éviter l'expiration de la requête.
    .catch(error => res.status(400).json ({error}));
}

exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file?
    {
      ...JSON.parse(req.body.sauce), //on récupére et on le parse en Objet
      imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}` //puis on modifie l'URI
    } : {...req.body}; //sinon on prend juste le corps de la req

    if (req.file){
      Sauce.findOne({_id: req.params.id})
      .then( (sauce) =>{
        const filename = sauce.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}`, () =>{
      Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) //on prend l'objet et modifie l'id pour correspondre à l'id des parametres de req.
      .then(() => res.status(200).json ({message:'Sauce modifié'}))
      .catch(error => res.status(400).json({error}));
        });
      });
    } else{

      Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) //on prend l'objet et modifie l'id pour correspondre à l'id des parametres de req.
      .then(() => res.status(200).json ({message:'Sauce modifié'}))
      .catch(error => res.status(400).json({error}));
    }   
};
    
    

//suppression de l'image puis de l'objet dans la BDD
exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
      .then( sauce =>{
        const filename = sauce.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}`, () =>{
          Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message :' Objet supprimé'}))
          .catch(error => res.status(400).json({error}));
        });
      })
      .catch(error => res.status(500).json({error}))
};

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
  };

exports.getAllSauce = (req, res, next) =>{
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
  };

//création des likes

exports.addLikeSauce = (req, res, next) =>{
  const userId = req.body.userId;
      switch (req.body.like){
        case 1:
            Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push:{usersLiked:userId}, _id: req.params.id} )
              .then(()=>{ res.status(200).json({message :'Votre avis a été pris en compte'})})
              .catch(error => res.status(400).json({error}));

          break;
        case 0:
          Sauce.findOne({_id: req.params.id})
          .then((sauce)=> {
            if(sauce.usersLiked.includes(userId)){
              Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull:{usersLiked:userId}, _id: req.params.id})
              .then(()=>{ res.status(200).json({message :'Votre avis a été pris en compte'})
            })
              .catch(error => res.status(400).json({error}));
            }else {
              Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull:{usersDisliked:userId}, _id: req.params.id})
              .then(()=>{ res.status(200).json({message :'Votre avis a été pris en compte'})
            })
              .catch(error => res.status(400).json({error}));
            }
          })
          .catch(error => res.status(400).json({error}));
          break
        case -1:
          Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push:{usersDisliked:userId}, _id: req.params.id} )
          .then(()=>{ res.status(200).json({message :'Votre avis a été pris en compte'});
          })
          .catch(error => res.status(400).json({error}));
        break;
      };
     
};


