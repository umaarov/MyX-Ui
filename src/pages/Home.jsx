import {useEffect, useState} from 'react';
import {fetchPosts} from '../services/api';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import {useAuth} from '../context/AuthContext';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchPosts();
            setPosts(data.data);
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = () => {
        loadPosts();
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {user && (
                <div className="mb-8">
                    <PostForm onSubmitSuccess={handlePostCreated}/>
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Latest Posts</h1>

            {loading ? (
                <p className="text-center py-6 text-gray-500">Loading posts...</p>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No posts yet.</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            onDelete={handlePostDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;