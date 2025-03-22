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
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password_confirmation">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="profile_photo">
                        Profile Photo (Optional)
                    </label>
                    <input
                        type="file"
                        id="profile_photo"
                        name="profile_photo"
                        onChange={handleChange}
                        className="w-full"
                        accept="image/*"
                    />
                    {errors.profile_photo && (
                        <p className="text-red-500 text-sm mt-1">{errors.profile_photo[0]}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Register
                    </button>
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;