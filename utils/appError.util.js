

class AppError extends Error{ //error es una clase de JS que necesitamos heredar para buscar errores mas puntualmente

    constructor(message, statusCode){
        super(message); //ejecutamos el contructor de la clase padre (Error)

        this.message = message;
        this.statusCode = statusCode;
        this.status = `$(statusCode)`.startsWith('4') ? 'error' : 'fail';

        //capture the error stack and add it to the AppError instance
        Error.captureStackTrace(this);
        //status = error 4xx => cliente || fail 5xx-> server
    }        
    }    
   

module.exports = { AppError }; 