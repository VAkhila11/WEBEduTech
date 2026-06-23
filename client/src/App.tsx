import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useAppStore } from "./store"
import Admin from "./pages/Admin"
import AICounselor from "./pages/AICounselor"
import Colleges from "./pages/Colleges"
import Community from "./pages/Community"
import Courses from "./pages/Courses"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Predictor from "./pages/Predictor"
import Profile from "./pages/Profile"
import Scholarships from "./pages/Scholarships"
import Signup from "./pages/Signup"
import "./App.css"

function FeaturePreviewRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((state) => state.user)

  if (user) return children

  const trialKey = "edutech-feature-preview-used"
  const previewUsed = localStorage.getItem(trialKey) === "true"

  if (previewUsed) {
    return <Navigate to="/signup?reason=feature-login" replace />
  }

  localStorage.setItem(trialKey, "true")
  return children
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<FeaturePreviewRoute><Courses /></FeaturePreviewRoute>} />
            <Route path="/colleges" element={<FeaturePreviewRoute><Colleges /></FeaturePreviewRoute>} />
            <Route path="/predictor" element={<FeaturePreviewRoute><Predictor /></FeaturePreviewRoute>} />
            <Route path="/scholarships" element={<FeaturePreviewRoute><Scholarships /></FeaturePreviewRoute>} />
            <Route path="/ai-counselor" element={<FeaturePreviewRoute><AICounselor /></FeaturePreviewRoute>} />
            <Route path="/community" element={<FeaturePreviewRoute><Community /></FeaturePreviewRoute>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
