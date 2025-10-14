import { ScanSearch, ShieldCheck, ThumbsUpIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const HomePage = () => {
  const { user } = useUserStore();
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
                      <h1 className="text-3xl lg:text-5xl font-bold my-10 text-white">Welcome!</h1>
                      <p className="text-lg mb-6 leading-relaxed">
                        PlateAccess is your all-in-one solution for modern parking management. Effortlessly monitor, control, and secure your parking facilities with real-time updates and intuitive tools.
                      </p>
                      {user ? (
                        <Link to="/dashboard" className="btn btn-outline btn-accent text-primary-content border-primary-content">
                          Get Started
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="btn btn-outline btn-accent text-primary-content border-primary-content"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                      <ThumbsUpIcon className="h-12 w-12 text-primary" />
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