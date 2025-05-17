import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RootLayout() {
    return (
        <div className="layout">
            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default RootLayout