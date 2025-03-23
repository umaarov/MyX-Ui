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

            if (!newComment || !newComment.id) {
                throw new Error("Invalid response from server");
            }

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
        <form onSubmit={handleSubmit} className="mb-6">
            {error && (
                <p className="text-red-500 text-sm mb-3 animate-fade-in">
                    {error}
                </p>
            )}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg text-gray-800
                              border border-gray-200 focus:outline-none focus:ring-2
                              focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200 disabled:opacity-60"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg
                              hover:bg-blue-700 focus:outline-none focus:ring-2
                              focus:ring-blue-500 focus:ring-offset-2
                              transition-all duration-200 disabled:bg-blue-400
                              disabled:cursor-not-allowed"
                    disabled={loading || !content.trim()}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Posting
                        </span>
                    ) : (
                        'Post'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;