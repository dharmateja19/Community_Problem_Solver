import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, RotateCw } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { setAuthData } from '../utils/auth.js';
import '../styles/AuthPages.css';

const OTPVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(interval);
        }
    }, [timer]);

    if (!email) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p>Please login or register first</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await API.post('/auth/verify-otp', {
                email,
                otp: otpString
            });

            setAuthData(response.data.user, response.data.token);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            await API.post('/auth/resend-otp', { email });
            
            setOtp(['', '', '', '', '', '']);
            setTimer(60);
            toast.success('OTP sent again');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Verify Your Email</h1>
                    <p>Enter the 6-digit OTP sent to {email}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                className="otp-input"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength="1"
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="resend-otp">
                    {timer > 0 ? (
                        <p>Resend in {timer} seconds</p>
                    ) : (
                        <button 
                            onClick={handleResendOTP}
                            disabled={resendLoading}
                        >
                            {resendLoading ? (
                                <>
                                    <RotateCw size={16} /> Resending...
                                </>
                            ) : (
                                <>
                                    <RotateCw size={16} /> Resend OTP
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTPVerify;
