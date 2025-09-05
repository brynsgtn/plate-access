const HomePage = () => {
  return (
    <>
      <div className="flex flex-col bg-base-200">
        <div className="flex items-center justify-center px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl min-h-[calc(100vh-8rem)]">
            <div className="rounded-lg">
              {/* Hero Section */}
              <div className="hero bg-base-200 min-h-screen">

                <div className="hero-content flex-col lg:flex-row-reverse">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    className="max-w-sm rounded-lg shadow-2xl"
                  />
                  <div>
                    <h1 className="text-5xl font-bold">Box Office News!</h1>
                    <p className="py-6">
                      Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                      quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <button className="btn btn-primary">Get Started</button>
                  </div>
                </div>

              </div>
              {/* Key Features Section */}
              <div>
                
              </div>
              <div className="w-full flex flex-col items-center mt-8 mb-12 px-4 bg-secondary">
                <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Card 1 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <h3 className="card-title">Real-time Updates</h3>
                      <p>Stay informed with instant notifications and live data updates across the platform.</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <h3 className="card-title">Secure Access</h3>
                      <p>Your data is protected with industry-leading security and authentication features.</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <h3 className="card-title">User Friendly</h3>
                      <p>Enjoy a seamless and intuitive interface designed for efficiency and ease of use.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Key Features Section */}

              {/* How It Works Section */}
              <div className="w-full flex flex-col items-center mb-12 px-4 bg-accent">
                <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Step 1 */}
                  <div className="card bg-base-100 shadow-md">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl font-bold mb-2">1</div>
                      <h3 className="card-title">Sign Up</h3>
                      <p>Create your account in seconds to get started with our platform.</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="card bg-base-100 shadow-md">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl font-bold mb-2">2</div>
                      <h3 className="card-title">Customize</h3>
                      <p>Set up your preferences and personalize your experience.</p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="card bg-base-100 shadow-md">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl font-bold mb-2">3</div>
                      <h3 className="card-title">Enjoy</h3>
                      <p>Access all features and enjoy seamless, secure service.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* End How It Works Section */}

              {/* Promotional Section */}
              <div className="hero bg-primary text-primary-content rounded-lg mb-12 px-4">
                <div className="hero-content flex-col md:flex-row">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
                    className="max-w-xs rounded-lg shadow-2xl mb-6 md:mb-0 md:mr-8"
                    alt="Promote our app"
                  />
                  <div>
                    <h2 className="text-4xl font-bold mb-2">Discover the Future of Parking Management</h2>
                    <p className="mb-4">
                      Streamline your parking operations, enhance security, and improve efficiency with our all-in-one platform.
                      Trusted by organizations for its reliability and ease of use, our app is designed to make parking management effortless.
                    </p>
                    <button className="btn btn-accent">Learn More</button>
                  </div>
                </div>
              </div>
              {/* End Promotional Section */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage