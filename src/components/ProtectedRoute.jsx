import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {useEffect, useState} from 'react';

const ProtectedRoute = ({children}) => {
    const {user, loading, refreshUser} = useAuth();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                if (!user) {
                    await refreshUser();
                }
            } catch (error) {
                console.error("Authentication verification failed:", error);
            } finally {
                setIsVerifying(false);
            }
        };

        if (!loading) {
            verifyAuthentication();
        }
    }, [loading, user, refreshUser]);

    if (loading || isVerifying) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center py-8">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login"/>;
    }

    return children;
};

export default ProtectedRoute;