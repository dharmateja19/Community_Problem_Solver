import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';

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

        setFormData((prev) => ({
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

            setFormData((prev) => ({
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

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.location.trim()
        ) {
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
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Problem reported successfully!');
            navigate(`/problems/${response.data.problem._id}`);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create problem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar user={user} />

            <div className="flex-1 max-w-[800px] mx-auto w-full px-4 py-8">

                <button
                    onClick={() => navigate('/problems')}
                    className="inline-flex items-center gap-2 text-[#10b981] font-semibold mb-8 transition hover:text-[#065f46] hover:-translate-x-1"
                >
                    <ArrowLeft size={20} />
                    Back to Problems
                </button>

                <section className="bg-white border-2 border-[#d1fae5] rounded-xl p-10 md:p-6">

                    <div className="mb-8 pb-6 border-b-2 border-[#d1fae5]">
                        <h1 className="text-[2rem] md:text-[1.5rem] text-[#065f46] font-bold mb-2">
                            Report a Community Problem
                        </h1>

                        <p className="text-[0.95rem] text-gray-500">
                            Help us understand the issue so we can work towards a solution
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                        {/* Title */}
                        <div className="flex flex-col">
                            <label className="flex justify-between items-center text-gray-700 font-semibold mb-3">
                                <span>Problem Title *</span>
                                <span className="text-[0.85rem] font-normal text-gray-500">
                                    {formData.title.length}/100
                                </span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Pothole on Main Street"
                                maxLength="100"
                                required
                                className="p-3.5 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10"
                            />

                            <p className="text-[0.85rem] text-gray-500 mt-2">
                                A clear, concise title for the problem (minimum 5 characters)
                            </p>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col">
                            <label className="flex justify-between items-center text-gray-700 font-semibold mb-3">
                                <span>Problem Description *</span>
                                <span className="text-[0.85rem] font-normal text-gray-500">
                                    {formData.description.length}/500
                                </span>
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                maxLength="500"
                                required
                                placeholder="Describe the problem in detail. What is happening? How does it affect the community?"
                                className="p-3.5 border-2 border-gray-300 rounded-lg text-gray-700 min-h-[150px] resize-y focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10"
                            />

                            <p className="text-[0.85rem] text-gray-500 mt-2">
                                Detailed description helps others understand better (minimum 20 characters)
                            </p>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-3">
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Main Street, Downtown Area"
                                className="p-3.5 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10"
                            />

                            <p className="text-[0.85rem] text-gray-500 mt-2">
                                Where is this problem located? Be as specific as possible
                            </p>
                        </div>

                        {/* Upload */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-3">
                                Upload Image (Optional)
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition hover:border-[#10b981] hover:bg-[#d1fae5]">

                                <input
                                    type="file"
                                    id="image-input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="image-input"
                                    className="flex flex-col items-center gap-3 cursor-pointer"
                                >
                                    <Upload size={24} className="text-[#10b981]" />
                                    <span className="text-gray-700 font-semibold">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-[0.85rem] text-gray-500">
                                        PNG, JPG up to 5MB
                                    </span>
                                </label>
                            </div>

                            {preview && (
                                <div className="mt-4 relative max-w-[300px]">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-full rounded-lg border-2 border-[#d1fae5]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                image: null
                                            }));
                                            setPreview(null);
                                        }}
                                        className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold transition hover:scale-110"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex md:flex-col gap-4 mt-8 pt-8 border-t-2 border-[#d1fae5]">

                            <button
                                type="button"
                                onClick={() => navigate('/problems')}
                                className="flex-1 py-3 rounded-lg border border-gray-300 font-semibold"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-lg bg-[#10b981] hover:bg-[#065f46] text-white font-semibold transition"
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