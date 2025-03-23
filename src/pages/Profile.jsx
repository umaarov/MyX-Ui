// Profile.jsx
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {user?.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            alt={userName}
                            className="w-24 h-24 rounded-full object-cover shadow-sm"
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl font-medium shadow-sm">
                            {userInitial}
                        </div>
                    )}

                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
                        <p className="text-gray-500 text-sm mb-2">@{userUsername}</p>
                        <p className="text-gray-600 text-sm">
                            <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                Member since {userCreatedAt}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <PostForm onSubmitSuccess={handleSubmitSuccess}/>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-6">
                    <button
                        className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
                            activeTab === 'posts'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('posts')}
                    >
                        My Posts
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
                            activeTab === 'likes'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('likes')}
                    >
                        Liked Posts
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-center py-6 text-gray-500">Loading posts...</p>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center py-6 text-gray-500">
                    {activeTab === 'posts' ? 'You haven’t created any posts yet.' : 'You haven’t liked any posts yet.'}
                </p>
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

export default Profile;