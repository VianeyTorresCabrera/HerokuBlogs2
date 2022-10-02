// Models
const { Post } = require('../models/post.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { PostImg } = require('../models/postImg.model');

//utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { uploadPostImgs, getPostsImgsUrls } = require('../utils/firebase.util');



const getAllPosts = catchAsync( async (req, res, next) => {
	
	const posts = await Post.findAll({
		attributes: ['id', 'title', 'content', 'createdAt'],
		include: [
			{ 
				model: User, 
				attributes: ['id', 'name'] },
			{
				model: Comment,
				required: false,//apply outer join 
				attributes: ['id', 'comment', 'createdAt'],
			},
			{
				model: PostImg,
			}
			],
	});	

	const postsWithImgs = await getPostsImgsUrls(posts);

	res.status(200).json({
		status: 'success',
		data: {
			posts: postsWithImgs,
			
		},
	});	
});

const createPost = catchAsync( async (req, res, next) => {
	
	const { title, content } = req.body;
	const { sessionUser} = req; //lo utilizamos para obtener el id del usuario logeado

	//console.log(req.body);
	//console.log(req.file);
	const newPost = await Post.create({ 
		title, 
		content, 
		userId: sessionUser.id //id del usuario activo en la sesion
	});

	 await uploadPostImgs(req.files, newPost.id); 	

	res.status(201).json({
		status: 'success',
		data: { newPost },			
	});
});

const updatePost = catchAsync(async (req, res, next) => {
	
		const { title, content } = req.body;
		const { post } = req;

		await post.update({ title, content });

		res.status(200).json({
			status: 'success',
			data: { post },
		});
	
});

const deletePost = catchAsync(async (req, res, next) => {
	
		const { post } = req;

		await post.update({ status: 'deleted' });

		res.status(200).json({
			status: 'success',
		});	
});

module.exports = {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
};
