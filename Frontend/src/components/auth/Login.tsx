import React, { useState } from "react";

interface LoginProps {
  onSwitchToSignUp: () => void;
  onLoginSuccess: (userData: any) => void;
}

export default function Login({ onSwitchToSignUp, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    
    // Simulate minor network delay for feedback
    setTimeout(() => {
      try {
        const mockUsersStr = localStorage.getItem("mock_users");
        let mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];
        
        if (mockUsers.length === 0) {
          const defaults = [
            { id: 1, name: "Participant One", email: "p1@evalsphere.com", password: "Pass@123", role: "PARTICIPANT" },
            { id: 2, name: "TalentBridge Inc", email: "company@evalsphere.com", password: "Pass@123", role: "COMPANY" }
          ];
          localStorage.setItem("mock_users", JSON.stringify(defaults));
          mockUsers = defaults;
        }

        const matchedUser = mockUsers.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (matchedUser) {
          const loggedInUser = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
          };
          const token = "mock-session-token-" + Math.random().toString(36).substring(2);
          
          // Store session in sessionStorage as requested by user
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(loggedInUser));
          onLoginSuccess(loggedInUser);
        } else {
          setError("Invalid email or password. Please use the credentials provided below.");
        }
      } catch (err: any) {
        setError("Error validating credentials.");
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-8">
      {/* Form title */}
      <h2 className="text-3xl font-semibold text-left text-gray-900 mb-6 font-sans">
        Log in
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5 font-sans">
            Email address or user name
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-sans text-gray-900 text-base"
            placeholder="Enter your email or username"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-gray-500 font-sans">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors focus:outline-none font-sans"
            >
              {showPassword ? (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  Hide
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Show
                </>
              )}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-sans text-gray-900 text-base"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-800 font-sans cursor-pointer selection:bg-transparent"
          >
            Remember me
          </label>
        </div>

        {/* Terms of use */}
        <div className="text-xs text-gray-500 pt-1 font-sans">
          By continuing, you agree to the{" "}
          <a href="#" className="underline hover:text-gray-800 transition-colors">
            Terms of use
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-800 transition-colors">
            Privacy Policy
          </a>
          .
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 px-4 rounded-full text-white font-medium text-base font-sans transition-all duration-200 ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-300 hover:bg-violet-600 active:scale-[0.99]"
          }`}
          style={{
            backgroundColor: email && password && !loading ? "#7c3aed" : "#c4c4c7",
          }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="mt-5 text-center">
        <a
          href="#"
          className="text-sm font-semibold text-gray-800 hover:text-violet-600 underline transition-colors font-sans"
        >
          Forget your password
        </a>
      </div>

      {/* Switch to Register */}
      <div className="mt-4 text-center text-sm text-gray-600 font-sans">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchToSignUp}
          className="font-semibold text-gray-800 hover:text-violet-600 underline transition-colors focus:outline-none"
        >
          Sign up
        </button>
      </div>

      {/* Social Logins Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm font-sans">
          <span className="px-3 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center space-x-6 items-center">
        {/* Facebook */}
        <button className="p-2.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none">
          <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        </button>

        {/* Apple */}
        <button className="p-2.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39z" />
          </svg>
        </button>

        {/* Google */}
        <button className="p-2.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>

        {/* Twitter */}
        <button className="p-2.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none">
          <svg className="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </button>
      </div>

      {/* Mock Credentials Box */}
      <div className="mt-8 p-4 bg-violet-50/50 border border-violet-100/80 rounded-2xl text-left text-xs font-sans text-gray-600">
        <div className="font-semibold text-violet-800 mb-1.5 flex items-center">
          <svg className="w-3.5 h-3.5 mr-1 text-violet-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mock Credentials (Click to copy)
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-violet-100/50">
            <div>
              <span className="font-medium text-gray-400 block text-[9px] uppercase tracking-wider">Participant Account</span>
              <span className="font-mono text-gray-800 font-medium">p1@evalsphere.com</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-400 block text-[9px] uppercase tracking-wider">Password</span>
              <span className="font-mono text-gray-800 font-medium">Pass@123</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-violet-100/50">
            <div>
              <span className="font-medium text-gray-400 block text-[9px] uppercase tracking-wider">Company Account</span>
              <span className="font-mono text-gray-800 font-medium">company@evalsphere.com</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-400 block text-[9px] uppercase tracking-wider">Password</span>
              <span className="font-mono text-gray-800 font-medium">Pass@123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

