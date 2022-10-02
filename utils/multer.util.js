const multer = require('multer');
//const path = require('path');

//almacenar en NODE
 /*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destPath = path.join(__dirname,'..','imgs');
        console.log(destPath);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        console.log(file);*/

        //file->
        /*fieldname: 'postImg',
        originalname: 'pug.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg'*/

        //pug.jpg -> pug-12345.jpg
        /*const [originalName, ext] = file.originalname.split('.');  //---->[] --->[pug, jpg]

        const filename = `${originalName}-${Date.now()}.${ext}`;
        
        cb(null, filename);
    },
 });*/

 //almacenar en firebase
 const storage = multer.memoryStorage();

 const upload = multer({storage});

 module.exports = { upload };