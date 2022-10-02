// Models
const { User } = require('../models/user.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.util');

const userExists =  catchAsync( async (req, res, next) => {
	
		const { id } = req.params; //extrae id de params

		const user = await User.findOne({ 
			attributes: { exclude: ['password'] },
			 where: { id } 
		});//busca usuario por id

		// If user doesn't exist, send error message
		//vefifica si el usuario existe
		if (!user) {
			return next(new AppError('User not found', 404));		
		}

		// req.anyPropName = 'anyValue'
		req.user = user; //me adjunta el usuario  de la sesion
		next();	
});

module.exports = {
	userExists,
};
