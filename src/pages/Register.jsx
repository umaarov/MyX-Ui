import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        profile_photo: null,
    });
    const [errors, setErrors] = useState({});
    const {register, error} = useAuth();

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'profile_photo' && files && files[0]) {
            setFormData({...formData, profile_photo: files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await register(formData);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-gray-800
                                 border border-gray-200 focus:outline-none focus:ring-2
                                 focus:ring-green-500 focus:border-transparent
                                 transition-all duration-200"
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-gray-800
                                 border border-gray-200 focus:outline-none focus:ring-2
                                 focus:ring-green-500 focus:border-transparent
                                 transition-all duration-200"
                        required
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-gray-800
                                 border border-gray-200 focus:outline-none focus:ring-2
                                 focus:ring-green-500 focus:border-transparent
                                 transition-all duration-200"
                        required
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="password_confirmation" className="block text-gray-700 font-medium mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-gray-800
                                 border border-gray-200 focus:outline-none focus:ring-2
                                 focus:ring-green-500 focus:border-transparent
                                 transition-all duration-200"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="profile_photo" className="block text-gray-700 font-medium mb-2">
                        Profile Photo (Optional)
                    </label>
                    <input
                        type="file"
                        id="profile_photo"
                        name="profile_photo"
                        onChange={handleChange}
                        className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4
                                 file:rounded-lg file:border-0 file:text-sm file:font-medium
                                 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200
                                 transition-colors duration-200"
                        accept="image/*"
                    />
                    {errors.profile_photo && (
                        <p className="text-red-500 text-sm mt-1">{errors.profile_photo[0]}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg
                                 font-medium transition-all duration-200 focus:outline-none
                                 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Register
                    </button>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;