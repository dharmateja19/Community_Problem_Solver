import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../utils/auth.js';
import '../styles/Navbar.css';

const Navbar = ({ user, notifications = [] }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <h1>CPS</h1>
                </div>

                <button 
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <a 
                        href="/dashboard" 
                        className={location.pathname === '/dashboard' ? 'active' : ''}
                    >
                        Dashboard
                    </a>
                    <a 
                        href="/problems" 
                        className={location.pathname === '/problems' ? 'active' : ''}
                    >
                        Problems
                    </a>
                    <a 
                        href="/create-problem" 
                        className={location.pathname === '/create-problem' ? 'active' : ''}
                    >
                        Report Problem
                    </a>
                    <a 
                        href="/notifications" 
                        className={location.pathname === '/notifications' ? 'active' : ''}
                    >
                        Notifications
                    </a>
                    {user && (
                        <>
                            <a 
                                href="/profile" 
                                className={location.pathname === '/profile' ? 'active' : ''}
                            >
                                My Profile
                            </a>
                        </>
                    )}
                </div>

                <div className="nav-end">
                    {user && (
                        <>
                            <button
                                className="notification-bell"
                                onClick={() => navigate('/notifications')}
                                title="Open notifications"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount}</span>
                                )}
                            </button>
                            <button 
                                className="user-info"
                                onClick={() => navigate('/profile')}
                                title="Go to Profile"
                            >
                                <span className="user-name">{user.name}</span>
                            </button>
                        </>
                    )}
                    {user && (
                        <button className="logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
