import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className='navbar'>
            <NavLink to="/">
                <span className='navbar-logo-header'>
                    <img src="/logo.svg" alt="Starward Budgets logo" className='logo-img' />
                    Starward Budgets</span>
            </NavLink>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ marginRight: '20px' }}>Welcome {user.name}</h2>
                <button className='btn' onClick={() => logout()}>Log out</button>
            </div>
        </nav>
    )
}

export default Navbar