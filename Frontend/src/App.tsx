import { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import "./App.css";

type ViewState = "login" | "signup" | "dashboard";

function App() {
  const [view, setView] = useState<ViewState>("login");
  const [user, setUser] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Check if user is already logged in on load
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setView("dashboard");
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setView("dashboard");
    showToast(`Welcome back, ${userData.name}!`);
  };

  const handleSignUpSuccess = () => {
    setView("login");
    showToast("Registration successful! Please log in.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setView("login");
    showToast("Logged out successfully.");
  };


  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleBack = () => {
    if (view === "signup") {
      setView("login");
    } else if (view === "dashboard") {
      handleLogout();
    } else {
      showToast("Already at the starting page.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header bar matching user screenshot */}
      <header className="w-full h-16 border-b border-gray-200 flex items-center px-6 relative bg-white select-none">
        {/* Back arrow on left */}
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        {/* Center circle logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center animate-bounce">
          <svg
            className="w-4 h-4 mr-2 text-violet-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center bg-white">
        {view === "login" && (
          <Login
            onSwitchToSignUp={() => setView("signup")}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {view === "signup" && (
          <SignUp
            onSwitchToLogin={() => setView("login")}
            onSignUpSuccess={handleSignUpSuccess}
          />
        )}

        {view === "dashboard" && user && (
          <div className="w-full max-w-xl mx-auto px-6 py-12 text-center">
            {/* Logged in Welcome Screen */}
            <div className="bg-gradient-to-tr from-violet-100 to-indigo-50 border border-violet-100 rounded-3xl p-8 shadow-xl relative overflow-hidden text-left">
              <div className="absolute right-0 top-0 w-32 h-32 bg-violet-200 opacity-20 rounded-full blur-2xl"></div>
              <div className="absolute left-10 bottom-0 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-xl"></div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold text-violet-700 bg-violet-100 border border-violet-200">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 text-sm border-t border-gray-200/60 pt-5">
                <div className="flex justify-between py-1 border-b border-gray-100/50">
                  <span className="font-medium text-gray-400">EMAIL ADDRESS</span>
                  <span className="text-gray-800 font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-gray-400">USER ID</span>
                  <span className="text-gray-800 font-mono font-semibold">#{user.id}</span>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 rounded-full text-white font-medium bg-red-500 hover:bg-red-600 transition-colors shadow-sm text-center"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;


