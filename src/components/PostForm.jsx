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
            if (post.photo) {
                setPhotoPreview(post.photo);
            }
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

            const postData = {
                content,
                photo
            };

            let response;
            if (isEditing) {
                response = await updatePost(postId, postData);
            } else {
                response = await createPost(postData);
            }

            setContent('');
            setPhoto(null);
            setPhotoPreview('');

            if (typeof onSubmitSuccess === 'function') {
                onSubmitSuccess(response.data);
            }
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
        return <div className="text-center py-4">Loading post data...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Post' : 'Create a New Post'}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Post something..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                {photoPreview && (
                    <div className="mb-4 relative">
                        <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-auto rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                            Remove
                        </button>
                    </div>
                )}

                <div className="flex justify-between">
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
                            className="inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Add Photo
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : isEditing ? 'Update Post' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;