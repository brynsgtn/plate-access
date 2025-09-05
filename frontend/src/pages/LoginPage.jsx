const LoginPage = () => {
    return (
        <div className="flex flex-col items-center min-h-[80vh] bg-base-200">
            {/* Logo and App Name */}
            <div className="flex flex-col items-center mb-4">
                <img
                    src="/logo.png"
                    alt="PlateAccess Logo"
                    className="w-20 h-20 mb-2 my-6"
                />
                <h1 className="text-3xl font-bold text-primary mb-1">PlateAccess</h1>
                <p className="text-base text-base-content/70">Modern Parking Management Login</p>
            </div>
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-xs border p-6 shadow">
                 <legend className="fieldset-legend">Login</legend>

                <label className="label" htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="Enter your email"
                    autoComplete="email"
                />

                <label className="label mt-2" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />



                <button className="btn btn-primary w-full mt-6">Login</button>
            </fieldset>
        </div>
    )
}

export default LoginPage;