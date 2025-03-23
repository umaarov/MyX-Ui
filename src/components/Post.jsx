import {useState} from 'react';
import {Link} from 'react-router-dom';
import {deletePost, togglePostLike} from '../services/api';
import {useAuth} from '../context/AuthContext';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const Post = ({post, onDelete, onUpdate}) => {
    const {user} = useAuth();
    const [isLiked, setIsLiked] = useState(post?.is_liked || false);
    const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post?.comments || []);

    if (!post) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                Post data unavailable
            </div>
        );
    }

    const postUser = post.user || {};
    const postUserName = postUser.name || 'Unknown User';
    const postUserUsername = postUser.username || 'unknown';
    const formattedDate = post.created_at ? new Date(post.created_at).toLocaleString() : '';
    const isOwnPost = user && user.id && postUser.id && user.id === postUser.id;

    const handleLike = async () => {
        try {
            const response = await togglePostLike(post.id);
            setIsLiked(response.is_liked);
            setLikesCount(response.likes_count);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(post.id);
                if (typeof onDelete === 'function') onDelete(post.id);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleAddComment = (newComment) => {
        if (!newComment || !newComment.id) return;
        setComments((prev) => [newComment, ...prev]);
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-4">
                {postUser.profile_photo ? (
                    <img
                        src={postUser.profile_photo}
                        alt={postUserName}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                ) : (
                    <div
                        className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-gray-600 font-medium">
                        {postUserName.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-800">{postUserName}</p>
                    <p className="text-xs text-gray-500">@{postUserUsername} • {formattedDate}</p>
                </div>
            </div>

            <p className="mb-4 text-gray-700 leading-relaxed">{post.content}</p>

            {post.photo && (
                <img
                    src={post.photo}
                    alt="Post"
                    className="w-full rounded-lg mb-4 object-cover max-h-96"
                />
            )}

            <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-sm ${isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
                    >
                        <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <span>{likesCount}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <span>{comments.length}</span>
                    </button>
                </div>

                {isOwnPost && (
                    <div className="flex space-x-4">
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {showComments && (
                <div className="mt-6">
                    <CommentForm postId={post.id} onAddComment={handleAddComment}/>
                    <CommentList comments={comments} onDeleteComment={handleDeleteComment}/>
                </div>
            )}
        </div>
    );
};

export default Post;