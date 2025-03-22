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
        <div className="max-w-2xl mx-auto p-4">
            {user && (
                <PostForm onSubmitSuccess={handlePostCreated}/>
            )}

            <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>

            {loading ? (
                <p className="text-center py-4">Loading posts...</p>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center py-4">No posts yet.</p>
            ) : (
                <div className="space-y-4">
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