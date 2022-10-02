const express = require('express');

// Controllers
const {
	getAllComments,
	createComment,
	updateComment,
	deleteComment,
} = require('../controllers/comments.controller');

// Middlewares
const { commentExists } = require('../middlewares/comments.middlewares');
const { 
	protectSession,
	protectCommentsOwner
 } = require('../middlewares/auth.middlewares');

const commentsRouter = express.Router();

commentsRouter.use(protectSession);

commentsRouter.get('/', getAllComments);

commentsRouter.post('/', createComment);

commentsRouter.patch('/:id', commentExists, protectCommentsOwner, updateComment);

commentsRouter.delete('/:id', commentExists, protectCommentsOwner, deleteComment);

module.exports = { commentsRouter };
