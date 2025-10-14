import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const NavBar = () => {
    const { logout, user } = useUserStore();
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Scroll hide/show
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 50) {
                // Scrolling down
                setIsHidden(true);
            } else {
                // Scrolling up
                setIsHidden(false);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Close mobile dropdowns and details when link clicked
    const handleLinkClick = () => {
        const details = document.querySelectorAll("details");
        details.forEach(d => d.removeAttribute("open"));

        const mobileDropdown = document.querySelector('.dropdown');
        if (mobileDropdown) {
            const input = mobileDropdown.querySelector('[tabIndex="0"]');
            if (input) input.blur();
        }
    };

    const renderLinks = () => {
        if (!user) return (
            <li>
                <Link to="/login" onClick={handleLinkClick}>
                    <LogIn className="w-4 h-4 mr-1 inline" /> Login
                </Link>
            </li>
        );

        const parkingStaffLinks = [
            { to: "/dashboard", label: "Dashboard" },
            { to: "/access-control", label: "Access Controls" },
            { to: "/access-logs", label: "Access Logs" },
            { to: "/vehicle-management", label: "Vehicle Management" },
        ];


        const adminLinks = [
            { to: "/dashboard", label: "Dashboard" },
            { to: "/access-logs", label: "Access Logs" },
            { to: "/vehicle-management", label: "Vehicle Management" },
            { to: "/user-management", label: "User Management" },
        ];

        const itAdminLinks = [
            { to: "/dashboard", label: "Dashboard" },
            { to: "/access-control", label: "Access Controls" },
            { to: "/user-management", label: "User Management" },
        ];

        const links = user.role === "parkingStaff" ? parkingStaffLinks : user.role === "admin" ? adminLinks : itAdminLinks;

        return links.map(link => (
            <li key={link.to}>
                <Link to={link.to} onClick={handleLinkClick}>{link.label}</Link>
            </li>
        ));
    };

    return (
        <div
            className={`navbar shadow-lg bg-gradient-to-r from-primary to-secondary text-primary-content py-5 font-medium text-xl sticky top-0 z-50 transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            {/* Navbar Start */}
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        {renderLinks()}
                        {user && <>
                            <div className="divider my-1"></div>
                            <li><Link to="/profile" onClick={handleLinkClick}>Profile</Link></li>
                            <li><button onClick={() => { logout(); handleLinkClick(); }} className="text-error">Logout</button></li>
                        </>}
                    </ul>
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 ml-2 text-2xl font-bold hover:opacity-80 transition-opacity">
                    <img src="/logo.png" alt="PlateAccess Logo" className="w-8 h-8" />
                    PlateAccess
                </Link>
            </div>

            {/* Navbar Center */}
            {user && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {renderLinks()}
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
                                    <li><Link to="/profile" className="hover:bg-base-200 text-primary">Profile</Link></li>
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