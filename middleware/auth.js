import Joi from 'joi';
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authoautrization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    
    res.json({
      message : 'you are note allowed to ....'
    })
  }

  exports.isMedcine = (req, res, next) => {
    if(req.auth.role == 0){
        return res.status(403).json({
            error: "Medcine Ressource, Access Denied"
        })
    }else if(req.auth.role == "medicine"){
      return next()
    }
}
exports.isSecretary = (req, res, next) => {
  if(req.auth.roleSecretary == 0){
      return res.status(403).json({
          error: "Secretary Ressource, Access Denied"
      })
  }else if(req.auth.roleSecretary == "secretary"){
    return next()
  }
}
exports.isPatient = (req, res, next) => {
    if(req.auth.role == 0){
        return res.status(403).json({
            error: "Patient Ressource, Access Denied"
        })
    }else if(req.auth.role == "patient"){
      return next()
    }
}






}
// export const forgotPasswordSchema = Joi.object({
//   email: Joi.string().email().required()
// });

// export const resetPasswordSchema = Joi.object({
//   password: Joi.string()
//     .min(8)
//     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
//     .required()
//     .messages({
//       'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
//     })
// });
module.exports = verifyToken;