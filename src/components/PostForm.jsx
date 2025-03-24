import {useEffect, useState} from 'react';
import {createPost, fetchPost, updatePost} from '../services/api';

const PostForm = ({postId, onSubmitSuccess}) => {
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);

    useEffect(() => {
        if (postId) {
            setIsEditing(true);
            loadPost(postId);
        }
    }, [postId]);

    const loadPost = async (id) => {
        try {
            setLoadingPost(true);
            const response = await fetchPost(id);
            const post = response.data;
            setContent(post.content || '');
            if (post.photo) setPhotoPreview(post.photo);
        } catch (err) {
            setError('Failed to load post data');
            console.error(err);
        } finally {
            setLoadingPost(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const postData = {content, photo};
            const response = isEditing ? await updatePost(postId, postData) : await createPost(postData);

            setContent('');
            setPhoto(null);
            setPhotoPreview('');
            if (typeof onSubmitSuccess === 'function') onSubmitSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPhotoPreview('');
    };

    if (loadingPost) {
        return <div className="text-center py-6 text-gray-500">Loading post data...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? 'Edit Post' : 'Create a New Post'}
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 border border-gray-200
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200 resize-y"
                    rows="4"
                    placeholder="Write"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                {photoPreview && (
                    <div className="mt-4 relative">
                        <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full rounded-lg object-cover max-h-96"
                        />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <div>
                        <input
                            type="file"
                            id="photo"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <label
                            htmlFor="photo"
                            className="inline-block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg
                                      cursor-pointer text-gray-700 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Add Photo
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                  transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing
                            </span>
                        ) : isEditing ? 'Update' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;