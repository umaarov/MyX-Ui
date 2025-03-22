import {useState} from 'react';
import {createComment} from '../services/api';

const CommentForm = ({postId, onAddComment}) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const newComment = await createComment({
                post_id: postId,
                content,
            });
            onAddComment(newComment);
            setContent('');
        } catch (err) {
            setError('Failed to add comment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading || !content.trim()}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;