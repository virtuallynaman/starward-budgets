import { FaGithub, FaUserAstronaut } from 'react-icons/fa'

function Footer() {
    return (
        <footer>
            <div className='footer-content'>
                <div className='footer-links'>
                    <a href="https://github.com/virtuallynaman/starward-budgets" target="_blank" rel="noopener noreferrer" ><FaGithub /> Github</a>
                    <a href="https://namanjha.vercel.app" target="_blank" rel="noopener noreferrer" ><FaUserAstronaut /> Portfolio</a>
                </div>
                <p className='copyright'>&copy; {new Date().getFullYear()} Starward Budgets</p>
            </div>
        </footer>
    )
}

export default Footer