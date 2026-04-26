import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';
import '../styles/CreateProblem.css';

const CreateProblem = () => {
    const navigate = useNavigate();
    const { user } = getAuthData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.title.length < 5) {
            toast.error('Problem title must be at least 5 characters');
            return;
        }

        if (formData.description.length < 20) {
            toast.error('Problem description must be at least 20 characters');
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('location', formData.location);
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            const response = await API.post('/problems/create', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Problem reported successfully!');
            navigate(`/problems/${response.data.problem._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create problem');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-problem-layout">
            <Navbar user={user} />

            <div className="create-problem-container">
                <button 
                    className="back-button"
                    onClick={() => navigate('/problems')}
                >
                    <ArrowLeft size={20} />
                    Back to Problems
                </button>

                <section className="create-form-section">
                    <div className="form-header">
                        <h1>Report a Community Problem</h1>
                        <p>Help us understand the issue so we can work towards a solution</p>
                    </div>

                    <form onSubmit={handleSubmit} className="create-form">
                        <div className="form-group">
                            <label className="form-label">
                                Problem Title *
                                <span className="char-count">{formData.title.length}/100</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Pothole on Main Street"
                                maxLength="100"
                                required
                                className="form-input"
                            />
                            <p className="form-hint">A clear, concise title for the problem (minimum 5 characters)</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Problem Description *
                                <span className="char-count">{formData.description.length}/500</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the problem in detail. What is happening? How does it affect the community?"
                                maxLength="500"
                                required
                                rows="6"
                                className="form-textarea"
                            ></textarea>
                            <p className="form-hint">Detailed description helps others understand the problem better (minimum 20 characters)</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Main Street, Downtown Area"
                                required
                                className="form-input"
                            />
                            <p className="form-hint">Where is this problem located? Be as specific as possible</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Upload Image (Optional)</label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-input"
                                    id="image-input"
                                />
                                <label htmlFor="image-input" className="upload-label">
                                    <Upload size={24} />
                                    <span>Click to upload or drag and drop</span>
                                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                                </label>
                            </div>

                            {preview && (
                                <div className="image-preview">
                                    <img src={preview} alt="preview" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, image: null }));
                                            setPreview(null);
                                        }}
                                        className="remove-image"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/problems')}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Reporting...' : 'Report Problem'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CreateProblem;
