import { useState, useEffect } from 'react'
import logo from '../assets/finanseeLogo.png'
import { useNavigation } from '../hooks/useNavigation'
import { useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import {useLogoutMutation} from "../store/api"

function Header() {
    const { currentPage } = useNavigation();
    const [isMobile, setIsMobile] = useState(false);
    const { theme, setTheme } = useTheme();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();


    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            navigate('/login');
        } catch {
            // Optionally handle error
            alert('Logout failed');
        }
    };

    const navigate = useNavigate();
    const navItems = [
        { name: 'Dashboard', path: 'dashboard' },
        { name: 'Customers', path: 'customers' },
        { name: 'Recommendation', path: 'recommendations' },
        { name: 'Reports', path: 'reports' },
        { name: 'Analytics', path: 'analytics' },
    ];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (isMobile) {
        return (
            <div className='bg-gray-100 dark:bg-gray-800 p-4 text-center'>
                <p className='text-red-500 font-medium'>Mobile UI is not ready yet. Please use desktop view.</p>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800'>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center py-4 gap-4">
                    <div className="flex-shrink-0">
                        <div className='flex items-center gap-2'>
                            <img src={logo} alt="logo" className='w-10 h-10' />
                            <p className='text-xl font-semibold whitespace-nowrap dark:text-white'>Finansee Dashboard</p>
                        </div>
                    </div>
                    <div className="flex-grow flex justify-center min-w-[300px]">
                        <div className='flex flex-wrap justify-center md:gap-5 lg:gap-10'>
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap ${currentPage.startsWith(item.path)
                                        ? 'text-[#00B2B2] border-b-2 border-[#00B2B2]'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-[#00B2B2]'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-auto">
                        <div className='flex items-center gap-4'>
                            <div
                                onClick={toggleTheme}
                                className={`relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                            >
                                <div
                                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
                                />
                                <div className="flex justify-between w-full px-1">
                                    <span className="text-xs">🌙</span>
                                    <span className="text-xs">☀️</span>
                                </div>
                            </div>
                            <div className='relative'>
                                <div
                                    className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center cursor-pointer'
                                    onClick={() => setDropdownOpen((open) => !open)}
                                >
                                    <span className='text-gray-600 dark:text-gray-300'>👤</span>
                                </div>
                                {dropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded shadow-lg z-10'>
                                        <button
                                            className='block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;