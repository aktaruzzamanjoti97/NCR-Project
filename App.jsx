import React, { useState } from 'react';
import { MessageCircle, Edit2, Save, X, Reply, User } from 'lucide-react';

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
          replies: []
        }
      ]
    },
    {
      id: 3,
      author: 'Bob Johnson',
      content: 'Interesting perspective. Could you elaborate more on the technical details?',
      timestamp: new Date('2024-01-15T12:00:00').toISOString(),
      replies: []
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('Anonymous User');

  const addComment = (parentId = null, replyContent = '') => {
    const newCommentObj = {
      id: generateId(),
      author: userName,
      content: replyContent || newComment,
      timestamp: new Date().toISOString(),
      replies: []
    };

    if (parentId === null) {
      setComments([...comments, newCommentObj]);
      setNewComment('');
    } else {
      const updateReplies = (commentList) => {
        return commentList.map(comment => {
          if (comment.id === parentId) {
            return { ...comment, replies: [...comment.replies, newCommentObj] };
          } else if (comment.replies.length > 0) {
            return { ...comment, replies: updateReplies(comment.replies) };
          }
          return comment;
        });
      };
      setComments(updateReplies(comments));
    }
  };

  const updateComment = (id, newContent) => {
    const updateCommentContent = (commentList) => {
      return commentList.map(comment => {
        if (comment.id === id) {
          return { ...comment, content: newContent };
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateCommentContent(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateCommentContent(comments));
  };

  const deleteComment = (id) => {
    const removeComment = (commentList) => {
      return commentList
        .filter(comment => comment.id !== id)
        .map(comment => ({
          ...comment,
          replies: removeComment(comment.replies)
        }));
    };
    setComments(removeComment(comments));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Comments ({comments.length})
        </h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            onClick={() => addComment()}
            disabled={!newComment.trim()}
            className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Post Comment
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
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
    <div style={{ marginLeft: `${marginLeft}px` }} className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{comment.author}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}
          
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-500 hover:text-gray-600 flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
          
          {isReplying && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map(reply => (
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

export default CommentSection;