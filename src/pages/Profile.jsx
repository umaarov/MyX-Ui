import {useEffect, useState} from 'react';
import {fetchLikedPosts, fetchUserPosts} from '../services/api';
import Post from '../components/Post';
import {useAuth} from '../context/AuthContext';
import PostForm from '../components/PostForm';

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

    const handleSubmitSuccess = () => {
        loadUserPosts();
    };

    const userName = user?.name || '';
    const userInitial = userName.length > 0 ? userName.charAt(0).toUpperCase() : '';
    const userUsername = user?.username || '';
    const userCreatedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date';

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {user?.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            alt={userName}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-3xl">{userInitial}</span>
                        </div>
                    )}

                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold">{userName}</h1>
                        <p className="text-gray-600 mb-2">@{userUsername}</p>
                        <p className="text-gray-700">
                            Member since {userCreatedAt}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <PostForm onSubmitSuccess={handleSubmitSuccess}/>
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