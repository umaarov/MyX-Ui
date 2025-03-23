import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const Navbar = () => {
    const {user, logout} = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <span
                                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                                MyTwitter
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                                >
                                    {user.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg
                                             text-sm font-medium transition-all duration-200 focus:outline-none
                                             focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
                                             text-sm font-medium transition-all duration-200 focus:outline-none
                                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg
                                             text-sm font-medium transition-all duration-200 focus:outline-none
                                             focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;