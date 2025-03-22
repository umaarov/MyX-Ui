import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {deleteComment, toggleCommentLike} from '../services/api';

const CommentList = ({comments, onDeleteComment}) => {
    if (!comments || comments.length === 0) {
        return <p className="text-gray-500 my-2">No comments yet</p>;
    }

    return (
        <div className="space-y-3 mt-3">
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
        <div className="p-3 bg-gray-50 rounded">
            <div className="flex justify-between">
                <div className="flex items-center">
                    {comment.user.profile_photo ? (
                        <img
                            src={comment.user.profile_photo}
                            alt={comment.user.name}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                            <span className="text-gray-600">{comment.user.name.charAt(0)}</span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-sm">{comment.user.name}</p>
                        <p className="text-xs text-gray-500">@{comment.user.username} • {formattedDate}</p>
                    </div>
                </div>

                {user && user.id === comment.user.id && (
                    <button
                        onClick={handleDelete}
                        className="text-xs text-gray-500 hover:text-red-500"
                    >
                        Delete
                    </button>
                )}
            </div>

            <p className="mt-2">{comment.content}</p>

            <div className="mt-2">
                <button
                    onClick={handleLike}
                    className={`text-xs flex items-center space-x-1 ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                >
                    <span>Like</span>
                    <span>({likesCount})</span>
                </button>
            </div>
        </div>
    );
};

export default CommentList;