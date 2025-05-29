import axios from "axios";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

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

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, { email, password });
            login(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="bg-darken-overlay"></div>
            <video autoPlay muted loop className="video-background" poster="fallback.jpg">
                <source src="/bg-video.mp4" type="video/mp4" />
            </video>
            <div className="auth-container">
                <div className="logo-header">
                    <h1>Starward Budgets</h1>
                    <p>Your money, your rules—simple budgeting for real life.</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-header">
                        <h1>Welcome Back</h1>
                        <p>Login to access your budgets</p>
                    </div>
                    <input
                        type="email"
                        className="credentials-input"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
                        disabled={isLoading}
                    />
                    <div className="credentials-container">
                        <input
                            type={isShowPassword ? "text" : "password"}
                            className="credentials-input"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            disabled={isLoading}
                        />
                        {password.trim() &&
                            <div className="credentials-action" onClick={toggleShowPassword}>
                                {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>}
                    </div>
                    {isLoading ? (
                        <button className="auth-btn auth-btn-on-loading" disabled>
                            <span className="auth-btn-loader"></span><span className="">Logging in</span>
                        </button>
                    ) : (
                        <button className="auth-btn">Log in</button>
                    )}

                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-hint">
                        <p>Don't have an account?</p>
                        <Link to={"/signup"}>Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login