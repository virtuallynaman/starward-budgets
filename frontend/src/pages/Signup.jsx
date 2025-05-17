import axios from "axios";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const { login } = useAuth();

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const toggleShowConfirmPassword = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!name.trim()) {
            setIsLoading(false);
            setError("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setIsLoading(false);
            setError("Please enter your email address.");
            return;
        }

        if (!password.trim()) {
            setIsLoading(false);
            setError("Please enter the password.");
            return;
        }

        if (!confirmPassword.trim()) {
            setIsLoading(false);
            setError("Please enter the password.");
            return;
        }

        if (password !== confirmPassword) {
            setIsLoading(false);
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, { name, email, password });
            login(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="bg-darken-overlay"></div>
            <video autoPlay muted loop className="video-background">
                <source src="/5466775-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            <div className="auth-container">
                <div className="logo-header">
                    <h1>Starward Budgets</h1>
                    <p>Your money, your rules—simple budgeting for real life.</p>
                </div>
                <form className="auth-form signup-form" onSubmit={handleSubmit}>
                    <div className="auth-form-header">
                        <h1>Get Started Now</h1>
                        <p>Create an account</p>
                    </div>
                    <input
                        className="credentials-input"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Name"
                        disabled={isLoading}
                    />
                    <input
                        className="credentials-input"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
                        disabled={isLoading}
                    />
                    <div className="credentials-container">
                        <input
                            className="credentials-input"
                            type={isShowPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            disabled={isLoading}
                        />
                        {password.trim() &&
                            <div className="credentials-action" onClick={toggleShowPassword}>
                                {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        }
                    </div>
                    <div className="credentials-container">
                        <input
                            className="credentials-input"
                            type={isShowConfirmPassword ? "text" : "password"}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder="Confirm password"
                            disabled={isLoading}
                        />
                        {confirmPassword.trim() &&
                            <div className="credentials-action" onClick={toggleShowConfirmPassword}>
                                {isShowConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        }
                    </div>

                    {isLoading ?
                        <button className="auth-btn" disabled>
                            <span className="loader"></span>
                            <span className="auth-btn-on-loading">Creating account</span>
                        </button>
                        :
                        <button className="auth-btn">Create account</button>
                    }

                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-hint">
                        <p>Already have an account?</p>
                        <Link to={"/login"}>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup