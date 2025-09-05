import { useEffect } from "react";
import { LogIn } from "lucide-react";

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

        document.addEventListener("click", handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const isAdmin = false;
    const user = true;
    return (
        <div className="navbar shadow-sm bg-primary text-primary-content py-5 font-medium text-xl">
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
                        className="menu menu-sm dropdown-content bg-primary rounded-none z-1 mt-3 w-52 p-2 shadow">

                        {
                            isAdmin ? (
                                // Admin user
                                <>
                                    <li >
                                        <a>System Monitoring</a>
                                        <ul className="p-2">
                                            <li><a>Access Logs</a></li>
                                            <li><a>Alerts</a></li>
                                            <li><a>Camera Status</a></li>
                                        </ul>
                                    </li>

                                    <li>
                                        <a>Vehicle Management</a>
                                        <ul className="p-2">
                                            <li><a>View Vehicles</a></li>
                                            <li><a>Register Vehicle</a></li>
                                            <li><a>Update Vehicle</a></li>
                                            <li><a>Delete Vehicle</a></li>
                                            <li><a>Blacklisted Vehicle</a></li>
                                            <li><a>Requests</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a>Username</a>
                                        <ul className="p-2">
                                            <li><a>Profile</a></li>
                                            <li><a>Logout</a></li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                // Non-admin user (Parking staff) 
                                <>

                                    <li>
                                        <a>Manual Intervention</a>
                                        <ul className="p-2">
                                            <li><a>Manual Plate Entry</a></li>
                                            <li><a>Gate Controls</a></li>
                                            <li><a>Add Vehicle</a></li>
                                        </ul>
                                    </li>
                                    <li >
                                        <a>Monitoring</a>
                                        <ul className="p-2">
                                            <li><a>Access Logs</a></li>
                                            <li><a>Status</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a>Blacklisted Vehicles</a>
                                        <ul className="p-2">
                                            <li><a>View Blacklisted Vehicles</a></li>
                                            <li><a>Add to Blacklist</a></li>
                                            <li><a>Remove from Blacklist</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a>Alerts</a>
                                        <ul className="p-2">
                                            <li><a>Verification Alerts</a></li>
                                            <li><a>Blacklisted Alert</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a>Username</a>
                                        <ul className="p-2">
                                            <li><a>Profile</a></li>
                                            <li><a>Logout</a></li>
                                        </ul>
                                    </li>
                                </>
                            )
                        }

                    </ul>
                </div>
                {/* Logo */}
                <a className="btn btn-ghost text-xl">PlateAccess</a>
            </div>

            {/* Navbar Center (Desktop Menu) */}
            {user && <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-4">

                    {isAdmin ? (
                        // Admin user
                        <>
                            <li>
                                <details>
                                    <summary>System Monitoring</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>Access Logs</a></li>
                                        <li><a>Alerts</a></li>
                                        <li><a>Camera Status</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <details>
                                    <summary>Vehicle Management</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>View Vehicles</a></li>
                                        <li><a>Register Vehicle</a></li>
                                        <li><a>Update Vehicle</a></li>
                                        <li><a>Delete Vehicle</a></li>
                                        <li><a>Blacklisted Vehicle</a></li>
                                        <li><a>Requests</a></li>
                                    </ul>
                                </details>
                            </li>
                        </>


                    ) : (
                        // Non-admin user (Parking staff) 
                        <>
                            <li>
                                <details>
                                    <summary>Manual Intervention</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>Manual Plate Entry</a></li>
                                        <li><a>Gate Controls</a></li>
                                        <li><a>Add Vehicle</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <details>
                                    <summary>Monitoring</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>Access Logs</a></li>
                                        <li><a>Status</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <details>
                                    <summary>Blacklisted Vehicles</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>View Blacklisted Vehicles</a></li>
                                        <li><a>Add to Blacklist</a></li>
                                        <li><a>Remove from Blacklist</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <details>
                                    <summary>Alerts</summary>
                                    <ul className="p-2 bg-primary rounded-none">
                                        <li><a>Verification Alerts</a></li>
                                        <li><a>Blacklisted Alert</a></li>
                                    </ul>
                                </details>
                            </li>
                        </>
                    )
                    }

                </ul>

            </div>
            }
            {/* Navbar End (Button, Profile, etc.) */}
            <div className="navbar-end hidden lg:flex me-5">
                {user ? (
                    <ul className="menu menu-horizontal px-1 text-lg">
                        <li>
                            <details>
                                <summary>Username</summary>
                                <ul className="bg-primary rounded-none p--2 w-full">
                                    <li><a>Profile</a></li>
                                    <li><a>Logout</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                ) : (
                    <ul className="menu menu-horizontal px-1 text-lg">
                        <li>
                            <a> <LogIn /> Login</a>
                        </li>
                    </ul>
                )
                }

            </div>
        </div>
    )
}


export default NavBar;

