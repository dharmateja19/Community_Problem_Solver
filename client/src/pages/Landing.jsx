import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, TrendingUp, MapPin } from 'lucide-react';
import '../styles/Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <h1 className="nav-brand">Community Problem Solver</h1>
                    <div className="nav-buttons">
                        <button className="btn-outline" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                        <button className="btn-primary" onClick={() => navigate('/register')}>
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Solve Community Problems Together
                    </h1>
                    <p className="hero-subtitle">
                        Report local issues, suggest solutions, and collaborate with your community to build a better tomorrow.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>
                            Start Solving Issues
                            <ArrowRight size={20} />
                        </button>
                        <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>
                            View Problems
                        </button>
                    </div>
                </div>
                <div className="hero-illustration">
                    <div className="illustration-box"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <h2 className="section-title">Why Choose Us?</h2>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon green">
                                <MapPin size={32} />
                            </div>
                            <h3>Location Based</h3>
                            <p>Report problems specific to your locality and view issues near you on an interactive map.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon blue">
                                <Users size={32} />
                            </div>
                            <h3>Community Driven</h3>
                            <p>Engage with neighbors, suggest solutions, and vote for the best ideas that make impact.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon emerald">
                                <TrendingUp size={32} />
                            </div>
                            <h3>Track Progress</h3>
                            <p>Monitor the status of reported problems from open to completion and celebrate wins together.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon amber">
                                <Zap size={32} />
                            </div>
                            <h3>AI Suggestions</h3>
                            <p>Get intelligent suggestions powered by AI to solve problems faster and more effectively.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="section-container">
                    <h2 className="section-title">How It Works</h2>
                    
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Register & Verify</h3>
                            <p>Create your account and verify your identity through our secure OTP system.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Report Issues</h3>
                            <p>Post problems in your community with descriptions, photos, and location details.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Suggest Solutions</h3>
                            <p>Propose practical solutions and get AI-powered suggestions for better ideas.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Vote & Collaborate</h3>
                            <p>Vote for the best solutions and collaborate with the community to implement them.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5</div>
                            <h3>Track Progress</h3>
                            <p>Monitor the implementation status and celebrate when problems are resolved.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">6</div>
                            <h3>Get Notified</h3>
                            <p>Receive real-time notifications about updates on problems you care about.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="section-container">
                    <div className="stats-grid">
                        <div className="stat">
                            <h3>1000+</h3>
                            <p>Issues Reported</p>
                        </div>
                        <div className="stat">
                            <h3>500+</h3>
                            <p>Solutions Proposed</p>
                        </div>
                        <div className="stat">
                            <h3>250+</h3>
                            <p>Problems Resolved</p>
                        </div>
                        <div className="stat">
                            <h3>5000+</h3>
                            <p>Active Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join thousands of community members working together to solve local problems.</p>
                    <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>
                        Join Now
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>About CPS</h4>
                            <p>Community Problem Solver is a platform dedicated to empowering communities through collaborative problem-solving and transparent tracking.</p>
                        </div>

                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how-it-works">How It Works</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Contact</h4>
                            <p>Email: support@communityproblemsolver.com</p>
                        </div>
                    </div>

                    <div className="footer-divider"></div>

                    <div className="developers-section">
                        <h4>Developed By</h4>
                        <div className="developers-list">
                            <span className="developer-badge">Suman</span>
                            <span className="developer-badge">Charan</span>
                            <span className="developer-badge">Dharma Teja</span>
                            <span className="developer-badge">Monika</span>
                            <span className="developer-badge">Mohan</span>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 Community Problem Solver. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
