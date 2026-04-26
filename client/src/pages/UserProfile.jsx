import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Edit2, LogOut, Loader, MapPin, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData, logout } from '../utils/auth.js';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user: currentUser } = getAuthData();
    const [user, setUser] = useState(currentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || ''
    });
    const [myProblems, setMyProblems] = useState([]);
    const [mySolutions, setMySolutions] = useState([]);
    const [myVotes, setMyVotes] = useState(0);
    const [stats, setStats] = useState({
        totalProblems: 0,
        activeSolutions: 0,
        totalVotes: 0,
        discussionsMade: 0
    });
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [currentUser, navigate]);

    const fetchUserData = async () => {
        try {
            // Fetch all problems to filter user's problems
            const problemsRes = await API.get('/problems');
            const allProblems = problemsRes.data.problems || [];
            const userProblems = allProblems.filter(p => p.user?._id === currentUser?._id);
            setMyProblems(userProblems);

            // Fetch all solutions to filter user's solutions
            const allProblems2 = allProblems;
            let userSolutions = [];
            for (const problem of allProblems2) {
                try {
                    const solutionsRes = await API.get(`/solutions/${problem._id}`);
                    const problemSolutions = solutionsRes.data.solutions || [];
                    userSolutions = userSolutions.concat(
                        problemSolutions.filter(s => s.user?._id === currentUser?._id)
                    );
                } catch (e) {
                    // Skip if solutions can't be fetched
                }
            }
            setMySolutions(userSolutions);

            // Fetch notifications for discussions count
            const notificationsRes = await API.get('/notifications');
            setNotifications(notificationsRes.data.notifications || []);

            // Calculate stats
            setStats({
                totalProblems: userProblems.length,
                activeSolutions: userSolutions.length,
                totalVotes: userSolutions.reduce((sum, sol) => sum + (sol.votes || 0), 0),
                discussionsMade: 0 // This would require a dedicated endpoint
            });

        } catch (error) {
            toast.error('Failed to load profile data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!editForm.name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        if (!editForm.email.trim()) {
            toast.error('Email cannot be empty');
            return;
        }

        try {
            const response = await API.put('/auth/profile', {
                name: editForm.name,
                email: editForm.email
            });

            setUser(response.data.user);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const normalizeStatus = (status) => {
        const value = String(status || 'open').toLowerCase().replace(/\s+/g, '-');
        if (value === 'inprogress') return 'in-progress';
        if (['open', 'in-progress', 'completed'].includes(value)) return value;
        return 'open';
    };

    const getStatusLabel = (status) => {
        const normalized = normalizeStatus(status);
        if (normalized === 'in-progress') return 'In Progress';
        if (normalized === 'completed') return 'Completed';
        return 'Open';
    };

    if (loading) {
        return (
            <div className="profile-layout">
                <Navbar user={user} notifications={notifications} />
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-layout">
            <Navbar user={user} notifications={notifications} />

            <div className="profile-container">
                {/* Profile Header */}
                <section className="profile-header">
                    <div className="profile-info">
                        <div className="avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <h1>{user?.name}</h1>
                            <p className="email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button 
                            className="btn-primary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                        <button 
                            className="btn-outline"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </section>

                {/* Edit Form */}
                {isEditing && (
                    <section className="edit-form">
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Stats Grid */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Problems</h3>
                        <p className="stat-value">{stats.totalProblems}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Solutions Suggested</h3>
                        <p className="stat-value">{stats.activeSolutions}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Votes Received</h3>
                        <p className="stat-value">{stats.totalVotes}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Contributions</h3>
                        <p className="stat-value">{stats.totalProblems + stats.activeSolutions}</p>
                    </div>
                </section>

                {/* My Problems */}
                <section className="contributions-section">
                    <h2>My Problems ({myProblems.length})</h2>
                    {myProblems.length > 0 ? (
                        <div className="problems-grid">
                            {myProblems.map(problem => (
                                <div 
                                    key={problem._id}
                                    className="problem-card"
                                    onClick={() => navigate(`/problems/${problem._id}`)}
                                >
                                    <h3>{problem.title}</h3>
                                    <p className="problem-desc">{problem.description.substring(0, 100)}...</p>
                                    <div className="problem-footer">
                                        <span className={`status-badge ${normalizeStatus(problem.status)}`}>
                                            {getStatusLabel(problem.status)}
                                        </span>
                                        <span className="location"><MapPin size={14} className="inline-icon" /> {problem.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">You haven't reported any problems yet.</p>
                    )}
                </section>

                {/* My Solutions */}
                <section className="contributions-section">
                    <h2>My Solutions ({mySolutions.length})</h2>
                    {mySolutions.length > 0 ? (
                        <div className="solutions-list">
                            {mySolutions.map(solution => (
                                <div key={solution._id} className="solution-item">
                                    <div className="solution-content">
                                        <h4>{solution.description.substring(0, 50)}...</h4>
                                        <p className="solution-meta">
                                            Votes: <strong>{solution.votes}</strong>
                                            {solution.isBestSolution && <span className="best-badge"><Star size={14} fill="currentColor" className="inline-icon" /> Best</span>}
                                        </p>
                                    </div>
                                    <button 
                                        className="btn-outline"
                                        onClick={() => navigate(`/problems/${solution.problem}`)}
                                    >
                                        View Problem
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">You haven't suggested any solutions yet.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default UserProfile;
