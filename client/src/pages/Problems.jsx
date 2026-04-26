import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Plus, Search, Filter, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';
import '../styles/Problems.css';

const Problems = () => {
    const navigate = useNavigate();
    const { user } = getAuthData();
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchProblems();
        fetchNotifications();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [problems, searchTerm, statusFilter, sortBy]);

    const fetchProblems = async () => {
        try {
            const response = await API.get('/problems');
            setProblems(response.data.problems || []);
        } catch (error) {
            toast.error('Failed to load problems');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await API.get('/notifications');
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...problems];

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (sortBy === 'latest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'urgent') {
            filtered.sort((a, b) => {
                const statusOrder = { open: 0, 'in-progress': 1, completed: 2 };
                return statusOrder[a.status] - statusOrder[b.status];
            });
        }

        setFilteredProblems(filtered);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const days = Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return d.toLocaleDateString();
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

    return (
        <div className="problems-layout">
            <Navbar user={user} notifications={notifications} />

            <div className="problems-container">
                <section className="problems-header">
                    <div className="header-content">
                        <h1>Community Problems</h1>
                        <p>Discover and contribute to solving local issues</p>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/create-problem')}
                    >
                        <Plus size={20} />
                        Report Problem
                    </button>
                </section>

                <section className="filters-section">
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search problems by title, description, or location..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-controls">
                        <div className="filter-group">
                            <label>Status:</label>
                            <div className="filter-buttons">
                                {['all', 'open', 'in-progress', 'completed'].map(status => (
                                    <button
                                        key={status}
                                        className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                                        onClick={() => handleStatusFilter(status)}
                                    >
                                        {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={handleSortChange} className="sort-select">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="urgent">Most Urgent</option>
                            </select>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : filteredProblems.length > 0 ? (
                    <section className="problems-grid">
                        {filteredProblems.map(problem => (
                            <div 
                                key={problem._id}
                                className="problem-card"
                                onClick={() => navigate(`/problems/${problem._id}`)}
                            >
                                <div className="card-header">
                                    <h3>{problem.title}</h3>
                                    <span className={`status-badge ${normalizeStatus(problem.status)}`}>
                                        {getStatusLabel(problem.status)}
                                    </span>
                                </div>

                                <p className="card-description">{problem.description.substring(0, 120)}...</p>

                                <div className="card-meta">
                                    <div className="meta-item">
                                        <MapPin size={16} />
                                        <span>{problem.location}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Clock size={16} />
                                        <span>{formatDate(problem.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="poster-info">
                                        <span className="poster-label">Posted by</span>
                                        <span className="poster-name">{problem.user?.name || 'Anonymous'}</span>
                                    </div>
                                </div>

                                <div className="card-image-placeholder">
                                    {problem.image ? (
                                        <img src={problem.image} alt={problem.title} />
                                    ) : (
                                        <img
                                            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80"
                                            alt="Community issue"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                ) : (
                    <div className="no-problems">
                        <p>No problems found matching your criteria.</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/create-problem')}
                        >
                            Be the first to report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Problems;
