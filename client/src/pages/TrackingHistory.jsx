import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';
import '../styles/TrackingHistory.css';

const TrackingHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = getAuthData();
    const [problem, setProblems] = useState(null);
    const [tracking, setTracking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchTrackingData();
    }, [id]);

    const fetchTrackingData = async () => {
        try {
            const problemRes = await API.get(`/problems/${id}`);
            setProblems(problemRes.data.problem);

            const trackingRes = await API.get(`/tracking/${id}`);
            setTracking(trackingRes.data.tracking || []);

            const notificationsRes = await API.get('/notifications');
            setNotifications(notificationsRes.data.notifications || []);
        } catch (error) {
            toast.error('Failed to load tracking data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return '#3b82f6'; // blue
            case 'in-progress':
                return '#f59e0b'; // amber
            case 'completed':
                return '#10b981'; // green
            default:
                return '#6b7280'; // gray
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return 'Unknown';
        return status === 'in-progress'
            ? 'In Progress'
            : status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="tracking-layout">
                <Navbar user={user} notifications={notifications} />
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="tracking-layout">
                <Navbar user={user} notifications={notifications} />
                <div className="tracking-container">
                    <p>Problem not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-layout">
            <Navbar user={user} notifications={notifications} />

            <div className="tracking-container">
                <button 
                    className="back-button"
                    onClick={() => navigate(`/problems/${id}`)}
                >
                    <ArrowLeft size={20} />
                    Back to Problem
                </button>

                <div className="tracking-content">
                    {/* Problem Header */}
                    <section className="problem-header-section">
                        <h1>Tracking History</h1>
                        <div className="problem-title">
                            <h2>{problem.title}</h2>
                            <span className={`status-badge ${problem.status}`}>
                                {getStatusLabel(problem.status)}
                            </span>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="timeline-section">
                        {tracking.length > 0 ? (
                            <div className="timeline">
                                {tracking.map((entry, index) => (
                                    <div key={entry._id} className="timeline-item">
                                        <div className="timeline-marker">
                                            <div 
                                                className="timeline-dot"
                                                style={{ backgroundColor: getStatusColor(entry.status) }}
                                            ></div>
                                            {index < tracking.length - 1 && <div className="timeline-line"></div>}
                                        </div>

                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <h3>Status Changed to <span className="status-label">{getStatusLabel(entry.status)}</span></h3>
                                                <span className="timestamp">
                                                    <Calendar size={16} />
                                                    {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <div className="timeline-meta">
                                                <span className="updated-by">
                                                    <User size={16} />
                                                    Updated by: <strong>{entry.updatedBy?.name || 'Unknown'}</strong>
                                                </span>
                                            </div>

                                            {entry.note && (
                                                <p className="timeline-note">{entry.note}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-timeline">
                                <p>No tracking history available yet.</p>
                            </div>
                        )}
                    </section>

                    {/* Summary Stats */}
                    <section className="summary-section">
                        <h3>Summary</h3>
                        <div className="summary-grid">
                            <div className="summary-card">
                                <span className="summary-label">Total Changes</span>
                                <span className="summary-value">{tracking.length}</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-label">Current Status</span>
                                <span className="summary-value" style={{ color: getStatusColor(problem.status) }}>
                                    {getStatusLabel(problem.status)}
                                </span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-label">Created</span>
                                <span className="summary-value">{new Date(problem.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-label">Last Updated</span>
                                <span className="summary-value">
                                    {tracking.length > 0 
                                        ? new Date(tracking[0].createdAt).toLocaleDateString()
                                        : new Date(problem.createdAt).toLocaleDateString()
                                    }
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TrackingHistory;
