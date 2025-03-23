import {useNavigate, useParams} from 'react-router-dom';
import PostForm from '../components/PostForm';

const EditPost = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <PostForm postId={id} onSubmitSuccess={handleSuccess}/>
        </div>
    );
};

export default EditPost;