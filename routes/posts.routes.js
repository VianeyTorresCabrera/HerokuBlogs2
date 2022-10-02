const express = require('express');

// Controllers
const {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
} = require('../controllers/posts.controller');

// Middlewares
const { postExists } = require('../middlewares/posts.middlewares');
const {
	 protectSession,
	protectPostAccount
} = require('../middlewares/auth.middlewares');
const {
	createPostValidators,
} = require('../middlewares/validators.middlewares');

//utils
const { upload } = require('../utils/multer.util');

const postsRouter = express.Router();

postsRouter.use(protectSession);

postsRouter.get('/', getAllPosts);
//get only 1 img
//postsRouter.post('/', upload.single('postImgs'), createPost);


postsRouter.post('/', upload.array('postImgs', 3 ), createPost);

postsRouter.patch('/:id', postExists, protectPostAccount, updatePost);

postsRouter.delete('/:id', postExists, protectPostAccount, deletePost);

module.exports = { postsRouter };

