import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchPost} from '../services/api';
import Post from '../components/Post';

const PostDetail = () => {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setLoading(true);
            const data = await fetchPost(id);
            setPost(data);
        } catch (err) {
            setError('Failed to load post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDeleted = () => {
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {loading ? (
                <p className="text-center py-4">Loading post...</p>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            ) : post ? (
                <Post post={post} onDelete={handlePostDeleted}/>
            ) : (
                <p className="text-center py-4">Post not found</p>
            )}
        </div>
    );
};

export default PostDetail;