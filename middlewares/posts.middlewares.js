// Models
const { Post } = require('../models/post.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.util');

const postExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const post = await Post.findOne({ where: { id } });

		if (!post) {
			return (new AppError('Post not found', 404));				
		}

		req.post = post;
		next();	
});

module.exports = { postExists };
