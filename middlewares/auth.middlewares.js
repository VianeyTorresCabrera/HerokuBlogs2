const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });


const protectSession = catchAsync(async (req, res, next) => {
	
		// Get token
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Extract token
			// req.headers.authorization = 'Bearer token'
			token = req.headers.authorization.split(' ')[1]; // -> [Bearer, token]
		}

		// Check if the token was sent or not
		if (!token) {
			return (new AppError('Invalid session', 403));
			
		}

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Verify the token's owner
		const user = await User.findOne({
			where: { id: decoded.id, status: 'active' },
		});

		if (!user) {
			return (new AppError('The owner of the session is no longer active',403));
		}

		// Grant access
		req.sessionUser = user;//here I know who made the request 
		next();
	
});


// Create a middleware to protect the users accounts
const protectUsersAccount = async(req, res, next)=> {
	// Check the sessionUser to compare to the one that wants to be updated/deleted
	const { sessionUser, user } = req;//extraer al usuario q quiero actualizar
	//const { id } = req.params; //another way//
 	
	if(sessionUser.id !== user.id){//verificar si el id del usuario en sesion es diferente al usuario encontrado
		//como no son iguales enviamos error
		return (new AppError('You are not the owner of this account', 403));		
	}
	// If the users (ids) don't match, send an error, otherwise continue
	next();	
	};

	//Create middleware to protect posts, only owners should be able to update/delete   
const protectPostAccount = async(req, res, next) =>{
	const { sessionUser, post} =req;

	if(sessionUser.id !== post.userId){//si el id del usuario en sesion es diferente al id del dueño del post
		return (new AppError('This post does not belong to you', 403));		
	};
	next();
}
	
	//Create middleware to protect comments, only owners should be able to update/delete   
const protectCommentsOwner = async(req, res, next) =>{
	const { sessionUser, comment } =req; //return commentExists  

	if(sessionUser.id != comment.userId){
		return (new AppError('This comment does not belong  to you', 403));				
	}
	next();
};

//create middleware thaht only grants access to admin users
const protectAdmin = (req, res, next) => {
	const { sessionUser } = req;

	if( sessionUser.role !== 'admin'){
		return (new AppError('You do not have tha access level for this data.', 403));		
	}
	next();
};


module.exports = {
	protectSession,
	protectUsersAccount,
	protectPostAccount,
	protectCommentsOwner,
	protectAdmin,
};
