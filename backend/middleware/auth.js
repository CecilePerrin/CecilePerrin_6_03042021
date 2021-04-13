const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //on va récupérer le token dans le headers en le split ca retourne un tableau
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); //ici on vérifie le token grâce à la clés secret
    const userId = decodedToken.userId; // une fois le token decodé on obtient un object js on va pourvoir récupérer l'userId dedans que l'on a encoder dedans exprès.
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};