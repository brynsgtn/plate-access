import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const { login } = useUserStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    login(usernameOrEmail, password);
    navigate("/dashboard");
    setUsernameOrEmail("");
    setPassword("");
  };

  // TODO - loading state

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
        <p className="text-base text-base-content/70">
          Modern Parking Management Login
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-xs border p-6 shadow"
      >
        <legend className="fieldset-legend">Login</legend>

        {/* Username or Email */}
        <label className="label" htmlFor="identifier">
          Username or Email Address
        </label>
        <input
          id="identifier"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter your email or username"
          autoComplete="username"
        />

        {/* Password */}
        <label className="label mt-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full pr-10"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-6"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
