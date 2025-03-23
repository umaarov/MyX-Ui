import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar/>
                    <main className="py-6">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/edit-post/:id"
                                element={
                                    <ProtectedRoute>
                                        <EditPost/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/posts/:id" element={<PostDetail/>}/>
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;