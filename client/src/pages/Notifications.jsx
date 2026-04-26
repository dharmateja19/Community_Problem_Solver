import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Bell, CheckCheck, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';
import '../styles/Notifications.css';

const Notifications = () => {
    const { user } = getAuthData();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await API.get('/notifications');
            setNotifications(response.data.notifications || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/read/${id}`);
            setNotifications((prev) => prev.map((item) => (
                item._id === id ? { ...item, isRead: true } : item
            )));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await API.patch('/notifications/read-all');
            setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark all as read');
        }
    };

    const formatDateTime = (value) => new Date(value).toLocaleString();

    return (
        <div className="notifications-layout">
            <Navbar user={user} notifications={notifications} />

            <div className="notifications-container">
                <section className="notifications-header">
                    <div>
                        <h1><Bell size={22} className="inline-icon" /> Notifications</h1>
                        <p>Stay updated on problem status, solutions, and community activity.</p>
                    </div>
                    <button
                        className="btn-outline"
                        onClick={markAllAsRead}
                        disabled={notifications.length === 0}
                    >
                        <CheckCheck size={18} />
                        Mark All Read
                    </button>
                </section>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="notifications-empty-card">
                        <img
                            src="https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=1000&q=80"
                            alt="No notifications"
                        />
                        <h3>No notifications yet</h3>
                        <p>When there is activity on your problems and solutions, updates will appear here.</p>
                    </div>
                ) : (
                    <section className="notifications-list">
                        {notifications.map((item) => (
                            <article key={item._id} className={`notification-card ${item.isRead ? 'read' : 'unread'}`}>
                                <div className="notification-main">
                                    <h3>{item.title}</h3>
                                    <p>{item.message}</p>
                                    <span className="notification-time">{formatDateTime(item.createdAt)}</span>
                                </div>
                                {!item.isRead && (
                                    <button className="btn-primary" onClick={() => markAsRead(item._id)}>
                                        <Check size={18} />
                                        Mark Read
                                    </button>
                                )}
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

export default Notifications;
