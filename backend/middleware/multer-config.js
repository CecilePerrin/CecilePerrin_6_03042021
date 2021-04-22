const multer = require('multer');//facilite la gestion de fichier

const MIME_TYPES = { 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//objet de config qui indique ou enregistrer et le nom de fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'image');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');//on génère le nom en enlevant les espace et en métant des _
    const extension = MIME_TYPES[file.mimetype]; //on applique une extension
    callback(null, name + Date.now() + '.' + extension); //creation du file avec le nom le time stamp et l'extension
  }
});

module.exports = multer({storage: storage}).single('image');