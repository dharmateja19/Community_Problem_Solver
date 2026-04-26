import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Plus, TrendingUp, MessageSquare, CheckCircle, MapPin, User } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = getAuthData();
    const [stats, setStats] = useState({
        totalProblems: 0,
        activeSolutions: 0,
        completedProblems: 0,
        myContributions: 0
    });
    const [recentProblems, setRecentProblems] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const normalizeStatus = (status) => {
        const value = String(status || 'open').toLowerCase().replace(/\s+/g, '-');
        if (value === 'inprogress') return 'in-progress';
        if (['open', 'in-progress', 'completed'].includes(value)) return value;
        return 'open';
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const problemsRes = await API.get('/problems');
                const notificationsRes = await API.get('/notifications');

                const problems = problemsRes.data.problems || [];
                setRecentProblems(problems.slice(0, 5));

                const completed = problems.filter(p => p.status === 'completed').length;
                const inProgress = problems.filter(p => p.status === 'in-progress').length;

                setStats({
                    totalProblems: problems.length,
                    activeSolutions: inProgress,
                    completedProblems: completed,
                    myContributions: 0
                });

                setNotifications(notificationsRes.data.notifications || []);
            } catch (error) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-layout">
            <Navbar user={user} notifications={notifications} />
            
            <div className="dashboard-container">
                <section className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {user?.name}!</h1>
                        <p>Your Community Problem Solver Dashboard</p>
                    </div>
                    <button className="btn-primary">
                        <Plus size={20} />
                        Post a Problem
                    </button>
                </section>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <section className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.totalProblems}</h3>
                                    <p>Total Problems</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.activeSolutions}</h3>
                                    <p>In Progress</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon emerald">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.completedProblems}</h3>
                                    <p>Completed</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon amber">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.myContributions}</h3>
                                    <p>My Contributions</p>
                                </div>
                            </div>
                        </section>

                        <section className="recent-problems-section">
                            <h2 className="section-title">Recent Problems</h2>
                            <div className="problems-list">
                                {recentProblems.length > 0 ? (
                                    recentProblems.map(problem => (
                                        <div key={problem._id} className="problem-item">
                                            <div className="problem-header">
                                                <h3>{problem.title}</h3>
                                                <span className={`status-badge ${normalizeStatus(problem.status)}`}>
                                                    {formatStatus(problem.status)}
                                                </span>
                                            </div>
                                            <p className="problem-description">{problem.description}</p>
                                            <div className="problem-meta">
                                                <span><MapPin size={16} className="inline-icon" /> {problem.location}</span>
                                                <span><User size={16} className="inline-icon" /> {problem.user?.name}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-issues-card">
                                        <img
                                            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
                                            alt="No community reports yet"
                                        />
                                        <p className="text-center text-muted">No problems reported yet</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
