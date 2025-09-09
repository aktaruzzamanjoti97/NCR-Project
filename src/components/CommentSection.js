"use client";

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Comment from './Comment';

const generateId = () => Date.now() + Math.random();

const CommentSection = () => {
	const [comments, setComments] = useState([
		{
			id: 1,
			author: 'John Doe',
			content: 'This is a great post! Thanks for sharing.',
			timestamp: new Date('2024-01-15T10:30:00').toISOString(),
			replies: [
				{
					id: 2,
					author: 'Jane Smith',
					content: 'I totally agree with you!',
					timestamp: new Date('2024-01-15T11:00:00').toISOString(),
					replies: [],
				},
			],
		},
		{
			id: 3,
			author: 'Bob Johnson',
			content:
				'Interesting perspective. Could you elaborate more on the technical details?',
			timestamp: new Date('2024-01-15T12:00:00').toISOString(),
			replies: [],
		},
	]);
	const [newComment, setNewComment] = useState('');
	const [userName, setUserName] = useState('Anonymous User');

	const addComment = (parentId = null, replyContent = '') => {
		const newCommentObj = {
			id: generateId(),
			author: userName,
			content: replyContent || newComment,
			timestamp: new Date().toISOString(),
			replies: [],
		};

		if (parentId === null) {
			setComments([...comments, newCommentObj]);
			setNewComment('');
		} else {
			const updateReplies = (commentList) => {
				return commentList.map((comment) => {
					if (comment.id === parentId) {
						return {
							...comment,
							replies: [...comment.replies, newCommentObj],
						};
					} else if (comment.replies.length > 0) {
						return {
							...comment,
							replies: updateReplies(comment.replies),
						};
					}
					return comment;
				});
			};
			setComments(updateReplies(comments));
		}
	};

	const updateComment = (id, newContent) => {
		const updateCommentContent = (commentList) => {
			return commentList.map((comment) => {
				if (comment.id === id) {
					return { ...comment, content: newContent };
				} else if (comment.replies.length > 0) {
					return {
						...comment,
						replies: updateCommentContent(comment.replies),
					};
				}
				return comment;
			});
		};
		setComments(updateCommentContent(comments));
	};

	const deleteComment = (id) => {
		const removeComment = (commentList) => {
			return commentList
				.filter((comment) => comment.id !== id)
				.map((comment) => ({
					...comment,
					replies: removeComment(comment.replies),
				}));
		};
		setComments(removeComment(comments));
	};

	return (
		<div className='max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen'>
			<div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
				<h2 className='text-2xl font-bold mb-6 flex items-center gap-2 text-black'>
					<MessageCircle className='w-6 h-6' />
					Comments ({comments.length})
				</h2>

				<div className='mb-4'>
					<input
						type='text'
						placeholder='Your name'
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className='w-full px-4 py-2 border border-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-2 text-black focus:ring-blue-500'
					/>
					<textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder='Write a comment...'
						className='w-full px-4 py-3 border border-gray-900 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
						rows='3'
					/>
					<button
						onClick={() => addComment()}
						disabled={!newComment.trim()}
						className='mt-3 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
						Post Comment
					</button>
				</div>
			</div>

			<div className='space-y-4'>
				{comments.map((comment) => (
					<Comment
						key={comment.id}
						comment={comment}
						onReply={addComment}
						onUpdate={updateComment}
						onDelete={deleteComment}
						userName={userName}
						depth={0}
					/>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
