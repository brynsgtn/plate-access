import { ScanSearch, ShieldCheck, ThumbsUp, Shield, Users, Camera, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const HomePage = () => {
  const { user } = useUserStore();

  const rolePrivileges = {
    "itAdmin": [
      { icon: Shield, title: "Full System Access", description: "Secure login with administrative dashboard access" },
      { icon: Users, title: "User Management", description: "Create users, assign roles, and manage account status" },
      { icon: ClipboardList, title: "Account Administration", description: "View user details, change roles, and modify branch assignments" },
      { icon: Camera, title: "Camera Configuration", description: "Configure network camera streams and RTSP settings" },
      { icon: Shield, title: "System Security", description: "Manage system access and security protocols" }
    ],
    "admin": [
      { icon: Shield, title: "Dashboard Access", description: "Secure login to access the administrative dashboard" },
      { icon: Users, title: "View Registered Users", description: "Access to view all registered users in the system" },
      { icon: ClipboardList, title: "Vehicle Management", description: "Add/edit vehicles, approve and deny registration/edit requests for vehicle/ vehicle information" },
      { icon: ScanSearch, title: "License Plate Monitoring", description: "View and manage license plate recognition data" }
    ],
    "parkingStaff": [
      { icon: Shield, title: "Dashboard Access", description: "Secure login to access staff dashboard" },
      { icon: ScanSearch, title: "Plate Recognition", description: "Monitor real-time vehicle plate detection" },
      { icon: ClipboardList, title: "Basic Vehicle Lookup", description: "View vehicle information and entry logs" },
      { icon: ThumbsUp, title: "Access Verification", description: "Verify vehicle access permissions" }
    ]
  };

  const getUserRole = () => {
    if (!user) return null;
    return user.role || null;
  };

  const currentRole = getUserRole();
  const privileges = currentRole ? rolePrivileges[currentRole] : null;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center px-4">
          <div className="rounded-xlshadow-cl w-full max-w-6xl min-h-[calc(100vh-8rem)]">
            <div className="rounded-lg">
              {/* Hero Section */}

              <div className="hero bg-gradient-to-r from-primary to-accent mt-10 p-8 text-primary-content rounded-3xl shadow-2xl">
                <div className="hero-content w-full max-w-none">
                  <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start w-full space-y-8 lg:space-y-0 lg:space-x-12">
                    <div className="lg:w-1/2 flex justify-center">
                      <img
                        src="./logo.png"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm rounded-lg object-contain"
                        alt="PlateAccess logo preview"
                      />
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                      <h1 className="text-3xl lg:text-4xl font-extrabold my-10 text-white tracking-tight leading-tight drop-shadow-lg">
                        WELCOME {user ? (user.username).toUpperCase() : "TO PLATEACCESS"}!
                      </h1>
                      <p className="text-base lg:text-lg mb-6 leading-relaxed text-white/90 font-light">
                        PlateAccess is your all-in-one solution for modern parking management. Effortlessly monitor, control, and secure your parking facilities with real-time updates and intuitive tools.
                      </p>
                      {user ? (
                        <Link to="/dashboard" className="btn btn-outline btn-accent text-primary-content border-primary-content hover:bg-white hover:text-primary transition-all duration-300 font-semibold">
                          Get Started
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="btn btn-outline btn-accent text-primary-content border-primary-content hover:bg-white hover:text-primary transition-all duration-300 font-semibold"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Privileges Section - Only shown when user is logged in */}
              {user && privileges && (
                <div className="w-full flex flex-col items-center mb-12 px-4 bg-none my-15">
                  <h2 className="text-3xl font-semibold mb-4">Your Access Privileges</h2>
                  <p className="text-lg mb-8 text-center max-w-2xl">
                    As a <span className="font-bold text-primary">{currentRole === "itAdmin" ? "IT Admin" : currentRole === "admin" ? "Admin" : "Parking Staff"}</span>, you have access to the following features and capabilities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    {privileges.map((privilege, index) => {
                      const Icon = privilege.icon;
                      return (
                        <div key={index} className="card bg-base-100 shadow-xl border-2 border-primary/20">
                          <div className="card-body items-center text-center">
                            <Icon className="h-10 w-10 text-primary mb-2" />
                            <h3 className="card-title text-lg">{privilege.title}</h3>
                            <p className="text-sm">{privilege.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* End User Privileges Section */}
              {/* Key Features Section */}
              <div className="w-full flex flex-col items-center my-15 mb-12 px-4 bg-none">
                <h2 className="text-3xl font-semibold mb-8">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Card 1 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <ScanSearch className="h-12 w-12 text-primary" />
                      <h3 className="card-title">Real-time Plate Recognition</h3>
                      <p>Instantly detect and log vehicle plates as they enter and exit your facility, ensuring accurate records and enhanced security.</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <ShieldCheck className="h-12 w-12 text-primary" />
                      <h3 className="card-title">Automated Access Control</h3>
                      <p>Grant or restrict entry automatically based on your custom rules, blacklists, and whitelists for seamless parking operations.</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <ThumbsUp className="h-12 w-12 text-primary" />
                      <h3 className="card-title">User-Friendly Dashboard</h3>
                      <p>Monitor activity, manage vehicles, and view alerts with an intuitive and easy-to-use interface designed for all staff levels.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Key Features Section */}

              {/* How It Works Section */}
              <div className="w-full flex flex-col items-center mb-12 px-4 bg-none my-15">
                <h2 className="text-3xl font-semibold mb-8">How PlateAccess Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Step 1 */}
                  <div className="shadow-lg">
                    <div className="card-body items-center text-center">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-3xl font-bold mb-2">1</div>
                      <h3 className="card-title">Monitor Plates</h3>
                      <p>Our system automatically recognizes and logs every vehicle plate entering or exiting your premises.</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="shadow-lg">
                    <div className="card-body items-center text-center">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-3xl font-bold mb-2">
                        2
                      </div>
                      <h3 className="card-title">Automate Access</h3>
                      <p>Set up rules to allow or deny access, manage blacklists, and receive instant alerts for flagged vehicles.</p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="shadow-lg">
                    <div className="card-body items-center text-center">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-3xl font-bold mb-2">3</div>
                      <h3 className="card-title">View Insights</h3>
                      <p>Access detailed logs, reports, and analytics to optimize your parking management and security.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* End How It Works Section */}



            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage