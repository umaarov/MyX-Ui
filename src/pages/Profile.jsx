import {useEffect, useState} from 'react';
import {fetchLikedPosts, fetchUserPosts} from '../services/api';
import Post from '../components/Post';
import {useAuth} from '../context/AuthContext';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        if (activeTab === 'posts') {
            loadUserPosts();
        } else if (activeTab === 'likes') {
            loadLikedPosts();
        }
    }, [activeTab]);

    const loadUserPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchUserPosts();
            setPosts(data.data);
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadLikedPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchLikedPosts();
            setPosts(data.data);
        } catch (err) {
            setError('Failed to load liked posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    if (!user) {
        return <div className="text-center py-8">Please login to view profile</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center space-x-4">
                    {user.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            alt={user.name}
                            className="w-20 h-20 rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-2xl">{user.name}</span>
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">@{user.username}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 border-b">
                <div className="flex">
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'posts'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('posts')}
                    >
                        My Posts
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'likes'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('likes')}
                    >
                        Liked Posts
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-center py-4">Loading posts...</p>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center py-4">
                    {activeTab === 'posts' ? 'You have not created any posts yet.' : 'You have not liked any posts yet.'}
                </p>
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

export default Profile;