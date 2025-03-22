import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const Navbar = () => {
    const {user, logout} = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold">Nav</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="text-gray-700">
                                    {user.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;