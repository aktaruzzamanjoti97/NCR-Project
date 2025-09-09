"use client";

import { Edit2, Reply, Save, User, X } from 'lucide-react';
import { useState } from 'react';

// Helper functions
const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diff = (now - date) / 1000; // seconds

	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
	return date.toLocaleDateString();
};

const Comment = ({ comment, onReply, onUpdate, onDelete, userName, depth }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [isReplying, setIsReplying] = useState(false);
	const [replyContent, setReplyContent] = useState('');

	const handleSave = () => {
		if (editContent.trim()) {
			onUpdate(comment.id, editContent);
			setIsEditing(false);
		}
	};

	const handleReply = () => {
		if (replyContent.trim()) {
			onReply(comment.id, replyContent);
			setReplyContent('');
			setIsReplying(false);
		}
	};

	const marginLeft = depth * 40;

	return (
		<div
			style={{ marginLeft: `${marginLeft}px` }}
			className='bg-white rounded-lg shadow-sm p-4'>
			<div className='flex items-start gap-3'>
				<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white'>
					<User className='w-5 h-5' />
				</div>

				<div className='flex-1'>
					<div className='flex items-center gap-2 mb-1'>
						<span className='font-semibold text-gray-800'>
							{comment.author}
						</span>
						<span className='text-sm text-gray-500'>
							{formatDate(comment.timestamp)}
						</span>
					</div>

					{isEditing ? (
						<div className='mt-2'>
							<textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className='w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
								rows='3'
							/>
							<div className='flex gap-2 mt-2'>
								<button
									onClick={handleSave}
									className='px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1'>
									<Save className='w-4 h-4' />
									Save
								</button>
								<button
									onClick={() => {
										setIsEditing(false);
										setEditContent(comment.content);
									}}
									className='px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1'>
									<X className='w-4 h-4' />
									Cancel
								</button>
							</div>
						</div>
					) : (
						<p className='text-gray-700 whitespace-pre-wrap'>
							{comment.content}
						</p>
					)}

					<div className='flex gap-3 mt-3'>
						<button
							onClick={() => setIsReplying(!isReplying)}
							className='text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1'>
							<Reply className='w-4 h-4' />
							Reply
						</button>
						<button
							onClick={() => setIsEditing(true)}
							className='text-sm text-gray-500 hover:text-gray-600 flex items-center gap-1'>
							<Edit2 className='w-4 h-4' />
							Edit
						</button>
						<button
							onClick={() => onDelete(comment.id)}
							className='text-sm text-red-500 hover:text-red-600'>
							Delete
						</button>
					</div>

					{isReplying && (
						<div className='mt-3 p-3 bg-gray-50 rounded-lg'>
							<textarea
								value={replyContent}
								onChange={(e) => setReplyContent(e.target.value)}
								placeholder={`Reply to ${comment.author}...`}
								className='w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
								rows='2'
							/>
							<div className='flex gap-2 mt-2'>
								<button
									onClick={handleReply}
									disabled={!replyContent.trim()}
									className='px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
									Reply
								</button>
								<button
									onClick={() => {
										setIsReplying(false);
										setReplyContent('');
									}}
									className='px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{comment.replies.length > 0 && (
				<div className='mt-4 space-y-3'>
					{comment.replies.map((reply) => (
						<Comment
							key={reply.id}
							comment={reply}
							onReply={onReply}
							onUpdate={onUpdate}
							onDelete={onDelete}
							userName={userName}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Comment;
