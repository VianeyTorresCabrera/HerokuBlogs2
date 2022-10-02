const { initializeApp } = require('firebase/app');
const { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
} = require('firebase/storage');

//model
const { PostImg } = require('../models/postImg.model');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env'});

const firebaseConfig = {

    apiKey: process.env.FIREBASE_API_KEY,  
    projectId: process.env.FIREBASE_PROYECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,    
    appId: process.env.FIREBASE_APP_ID
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  //storage service
  const storage = getStorage(firebaseApp);

  const uploadPostImgs = async ( imgs, postId ) => {
    //Tecnica Map Async permite realizar operaciones asincronas con arreglos
    const imgsPromises = imgs.map( async img => {
      //create firebase reference
      const [originalName, ext] = img.originalname.split('.');  //---->[] --->[pug, jpg]
  
      const filename = `posts/${postId}/${originalName}-${Date.now()}.${ext}`;
      const imgRef = ref(storage, filename);	
  
      //upload image to firebase
    const result = await uploadBytes(imgRef, img.buffer);
  
    await PostImg.create({ 
      postId, 
      imgUrl: result.metadata.fullPath, 	
    });    
    }); 

    await Promise.all(imgsPromises);
  };

  const  getPostsImgsUrls = async posts => {
    //recorrer el arreglo de los posts para obtener la url de la img
	const postsWithImgsPromises = posts.map( async post => {
		//getr imgs urls
		const postImgsPromises = post.postImgs.map(async postImg => {
			const imgRef = ref(storage, postImg.imgUrl);
			const imgUrl = await getDownloadURL(imgRef); 
			postImg.imgUrl = imgUrl;
			return postImg;			
		});		
		//permite resolver un arreglo de promesas
		const postImgs = await Promise.all(postImgsPromises);	
		
		//update  old postImgs array with new array
		post.postImgs = postImgs;
		return post;
	});
	
	return  await Promise.all(postsWithImgsPromises);
  }

  module.exports = { storage, uploadPostImgs, getPostsImgsUrls };