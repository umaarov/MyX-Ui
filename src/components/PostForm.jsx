import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createPost, fetchPost, updatePost} from '../services/api';

const PostForm = ({postId = null, onSubmitSuccess}) => {
    const [formData, setFormData] = useState({
        content: '',
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (postId) {
            setIsEdit(true);
            loadPost(postId);
        }
    }, [postId]);

    const loadPost = async (id) => {
        try {
            setLoading(true);
            const post = await fetchPost(id);
            setFormData({
                content: post.content,
                photo: post.photo || null,
            });
            setPhotoPreview(post.photo);
        } catch (err) {
            setError("Failed to load post");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'photo' && files && files[0]) {
            setFormData({...formData, photo: files[0]});
            setPhotoPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            if (isEdit) {
                await updatePost(postId, {
                    ...formData,
                    photo: formData.photo || undefined,
                });
            } else {
                await createPost(formData);
            }


            if (onSubmitSuccess) {
                onSubmitSuccess();
            } else {
                navigate('/');
            }

            setFormData({
                content: '',
                photo: null
            });
            setPhotoPreview(null);
        } catch (err) {
            setError('Failed to save post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePhoto = () => {
        setFormData({...formData, photo: null});
        setPhotoPreview(null);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-semibold mb-4">
                {isEdit ? 'Edit Post' : 'Create Post'}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
          <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              required
          />
                </div>

                {photoPreview && (
                    <div className="mb-4 relative">
                        <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full max-h-80 object-contain rounded-md"
                        />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md mr-2">
                            <input
                                type="file"
                                name="photo"
                                onChange={handleChange}
                                className="hidden"
                                accept="image/*"
                            />
                            Add Photo
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={loading || !formData.content}
                    >
                        {loading ? 'Saving...' : isEdit ? 'Update' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;