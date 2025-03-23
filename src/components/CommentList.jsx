import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {deleteComment, toggleCommentLike} from '../services/api';

const CommentList = ({comments, onDeleteComment}) => {
    if (!comments || comments.length === 0) {
        return <p className="text-gray-500 text-sm my-4">No comments yet</p>;
    }

    return (
        <div className="space-y-4 mt-4">
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                />
            ))}
        </div>
    );
};

const Comment = ({comment, onDeleteComment}) => {
    const {user} = useAuth();
    const [isLiked, setIsLiked] = useState(comment.is_liked);
    const [likesCount, setLikesCount] = useState(comment.likes_count);

    const handleLike = async () => {
        try {
            const response = await toggleCommentLike(comment.id);
            setIsLiked(response.is_liked);
            setLikesCount(response.likes_count);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(comment.id);
                onDeleteComment(comment.id);
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const formattedDate = new Date(comment.created_at).toLocaleString();

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md
                       transition-all duration-200 border border-gray-100">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {comment.user.profile_photo ? (
                        <img
                            src={comment.user.profile_photo}
                            alt={comment.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex
                                      items-center justify-center text-gray-600
                                      font-medium">
                            {comment.user.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800">
                            {comment.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            @{comment.user.username} • {formattedDate}
                        </p>
                    </div>
                </div>

                {user && user.id === comment.user.id && (
                    <button
                        onClick={handleDelete}
                        className="text-sm text-gray-500 hover:text-red-500
                                 transition-colors duration-200"
                    >
                        Delete
                    </button>
                )}
            </div>

            <p className="mt-3 text-gray-700 leading-relaxed">
                {comment.content}
            </p>

            <div className="mt-3">
                <button
                    onClick={handleLike}
                    className={`text-sm flex items-center gap-1.5 
                              ${isLiked ? 'text-blue-500' : 'text-gray-500'} 
                              hover:text-blue-600 transition-colors duration-200`}
                >
                    <svg
                        className="w-4 h-4"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <span>{likesCount}</span>
                </button>
            </div>
        </div>
    );
};

export default CommentList;