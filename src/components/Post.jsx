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
        return <div className="bg-white rounded-lg shadow-md p-4 mb-4">Post data unavailable</div>;
    }

    const postUser = post.user || {};
    const postUserName = postUser.name || 'Unknown User';
    const postUserUsername = postUser.username || 'unknown';
    const formattedDate = post.created_at ? new Date(post.created_at).toLocaleString() : '';

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
                if (typeof onDelete === 'function') {
                    onDelete(post.id);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleAddComment = (newComment) => {
        if (!newComment || !newComment.id) return;
        setComments((prevComments) => [newComment, ...prevComments]);
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    const isOwnPost = user && user.id && postUser.id && user.id === postUser.id;

    const userInitial = postUserName.length > 0 ? postUserName.charAt(0) : '?';

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-3">
                {postUser.profile_photo ? (
                    <img
                        src={postUser.profile_photo}
                        alt={postUserName}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                        <span className="text-gray-600">{userInitial}</span>
                    </div>
                )}
                <div>
                    <p className="font-semibold">{postUserName}</p>
                    <p className="text-xs text-gray-500">@{postUserUsername} • {formattedDate}</p>
                </div>
            </div>

            <p className="mb-3">{post.content}</p>

            {post.photo && (
                <img src={post.photo} alt="Post" className="w-full rounded-lg mb-3"/>
            )}

            <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                        <span>Like</span>
                        <span>({likesCount})</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1 text-gray-500"
                    >
                        <span>Comments</span>
                        <span>({comments.length})</span>
                    </button>
                </div>

                {isOwnPost && (
                    <div className="flex space-x-2">
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="text-gray-500 hover:text-blue-500"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-red-500"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {showComments && (
                <div className="mt-4">
                    <CommentForm postId={post.id} onAddComment={handleAddComment}/>
                    <CommentList
                        comments={comments}
                        onDeleteComment={handleDeleteComment}
                    />
                </div>
            )}
        </div>
    );
};

export default Post;