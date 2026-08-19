import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './config';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            email: formData.email.trim(),
            password: formData.password,
        };

        try {
            const response = await fetch(apiUrl('/api/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }

            onLoginSuccess({
                id: data.id,
                email: data.email,
                userName: data.userName,
            });
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </label>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in…' : 'Login'}
                </button>
            </form>
            <button type="button" className="auth-link" onClick={() => navigate('/signup')}>
                Create an account
            </button>
        </div>
    );
}

export default Login;
