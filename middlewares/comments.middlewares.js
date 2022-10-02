// Models
const { Comment } = require('../models/comment.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.util');

const commentExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const comment = await Comment.findOne({ where: { id } });

		if (!comment) {
			return (new AppError('Comment not found', 404));			
		}

		req.comment = comment;
		next();	
});
module.exports = { commentExists };
