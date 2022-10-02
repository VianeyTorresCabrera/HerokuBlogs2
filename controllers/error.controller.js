const dotenv = require('dotenv');
const { AppError } = require('../utils/appError.util');
dotenv.config({path:'./config.env'});


const sendErrorDev = (error, req, res) =>{
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,		
		error,
		stack: error.stack,
	});
};

const sendErrorProd = (error, req, res) =>{
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message || 'Something went wrong!',						
	});
};

const tokenExpiredError = () =>{
	return new AppError('Session Expired...',403);//regresa una nueva instancia de appError
}

const tokenInvalidSignatureError = () => {
	return new AppError('Session Invalid',403);
}

const dbUniqueConstrainError = () =>{
	return new AppError('The entered email has already been taken',400);
}

const imgLimitError = () => {
	return new AppError('You can only upload 3 imagen', 400);
}

const globalErrorHandler = (error, req, res, next) =>{
	//set default values for original error object
	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'fail';

	if(process.env.NODE_ENV === 'development'){
		sendErrorDev(error, req, res);
	}else if(process.env.NODE_ENV === 'production'){
		let err = {...error};//copia del error orignal en caso de no entrar en el if
		//when error is about expired token
		if(error.name === 'TokenExpiredError') err = tokenExpiredError(); 
		//When error is about invalid signature
		else if(error.name === 'JsonWebTokenError') err = tokenInvalidSignatureError();
		else if(error.name === 'SequelizeUniqueConstraintError') err = dbUniqueConstrainError();
		else if( error.code === 'LIMIT_UNEXPECTED_FILE' ) err = imgLimitError();
		sendErrorProd(err, req, res);
	}    
};

module.exports = { globalErrorHandler };