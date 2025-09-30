import { useEffect } from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";

const NavBar = () => {
    useEffect(() => {
        const details = document.querySelectorAll("details");

        // Accordion behavior
        details.forEach((targetDetail) => {
            targetDetail.addEventListener("toggle", () => {
                if (targetDetail.open) {
                    details.forEach((detail) => {
                        if (detail !== targetDetail) {
                            detail.removeAttribute("open");
                        }
                    });
                }
            });
        });

        // Close all dropdowns when clicking outside
        const handleClickOutside = (event) => {
            details.forEach((detail) => {
                if (detail.open && !detail.contains(event.target)) {
                    detail.removeAttribute("open");
                }
            });
        };

        // Close dropdowns when clicking on any link
        const handleLinkClick = () => {
            details.forEach((detail) => {
                detail.removeAttribute("open");
            });
            
            // Close mobile menu dropdown
            const mobileDropdown = document.querySelector('.dropdown');
            if (mobileDropdown) {
                const input = mobileDropdown.querySelector('[tabIndex="0"]');
                if (input) {
                    input.blur();
                }
            }
        };

        document.addEventListener("click", handleClickOutside);
        
        // Add click listeners to all links
        const links = document.querySelectorAll('.navbar a, .navbar button');
        links.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Cleanup
        return () => {
            document.removeEventListener("click", handleClickOutside);
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
            });
        };
    }, []);


    const { logout, user } = useUserStore();


    return (
        <div className="navbar shadow-lg bg-gradient-to-r from-primary to-secondary text-primary-content py-5 font-medium text-xl sticky top-0 z-50">
            {/* Navbar Start (Logo + Mobile Menu) */}
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-base-300">

                        {user ? (
                            <>
                                {user?.isAdmin ? (
                                    // Admin mobile menu
                                    <>
                                        <li><Link to="/dashboard">Dashboard</Link></li>
                                        <li><Link to="/access-logs">Access Logs</Link></li>
                                        <li><Link to="/vehicle-management">Vehicle Management</Link></li>
                                        <li><Link to="/user-management">User Management</Link></li>
                                        <div className="divider my-1"></div>
                                        <li><Link to="/profile">Profile</Link></li>
                                        <li><button onClick={logout} className="text-error">Logout</button></li>
                                    </>
                                ) : (
                                    // Non-admin mobile menu
                                    <>
                                        <li><Link to="/dashboard">Dashboard</Link></li>
                                        <li><Link to="/access-control">Access Controls</Link></li>
                                        <li><Link to="/access-logs">Access Logs</Link></li>
                                        <li><Link to="/vehicle-management">Vehicle Management</Link></li>
                                        <div className="divider my-1"></div>
                                        <li><Link to="/profile">Profile</Link></li>
                                        <li><button onClick={logout} className="text-error">Logout</button></li>
                                    </>
                                )}
                            </>
                        ) : (
                            <li>
                                <Link to="/login">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 ms-5 text-2xl font-bold hover:opacity-80 transition-opacity">
                    <img
                        src="/logo.png"
                        alt="PlateAccess Logo"
                        className="w-8 h-8"
                    />
                    PlateAccess
                </Link>
            </div>

            {/* Navbar Center (Desktop Menu) */}
            {user && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {user?.isAdmin ? (
                            // Admin desktop menu
                            <>
                                <li><Link to="/dashboard" className="hover:bg-primary-focus transition-colors">Dashboard</Link></li>
                                <li><Link to="/access-logs" className="hover:bg-primary-focus transition-colors">Access Logs</Link></li>
                                <li><Link to="/vehicle-management" className="hover:bg-primary-focus transition-colors">Vehicle Management</Link></li>
                                <li><Link to="/user-management" className="hover:bg-primary-focus transition-colors">User Management</Link></li>
                            </>
                        ) : (
                            // Non-admin desktop menu
                            <>
                                <li><Link to="/dashboard" className="hover:bg-primary-focus transition-colors">Dashboard</Link></li>
                                <li><Link to="/access-control" className="hover:bg-primary-focus transition-colors">Access Controls</Link></li>
                                <li><Link to="/access-logs" className="hover:bg-primary-focus transition-colors">Access Logs</Link></li>
                                <li><Link to="/vehicle-management" className="hover:bg-primary-focus transition-colors">Vehicle Management</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            {/* Navbar End (Profile/Login) */}
            <div className="navbar-end hidden lg:flex me-5">
                {user ? (
                    <ul className="menu menu-horizontal px-1 text-lg">
                        <li>
                            <details>
                                <summary className="text-primary-content hover:bg-primary-focus transition-colors cursor-pointer">
                                    {user?.username}
                                </summary>
                                <ul className="bg-base-100 text-base-content rounded-box p-2 w-48 z-50 absolute right-0 mt-2 shadow-xl border border-base-300">
                                    <li><Link to="/profile" className="hover:bg-base-200">Profile</Link></li>
                                    <li><button onClick={logout} className="text-error hover:bg-error/10">Logout</button></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                ) : (
                    <ul className="menu menu-horizontal px-1 text-lg">
                        <li>
                            <Link to="/login" className="hover:bg-primary-focus transition-colors">
                                <LogIn className="w-5 h-5" />
                                Login
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NavBar;