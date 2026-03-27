import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AuthPage from "./pages/AuthPage";
import BookmarksPage from "./pages/BookmarksPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import TestPage from "./pages/TestPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import AdminProblemsPage from "./pages/AdminProblemsPage";
import CodingPage from "./pages/CodingPage";
import CodingEditor from "./pages/CodingEditor";

const AppLayout = ({ children }) => (
  <div className="page-shell px-4 py-4 sm:px-6 lg:px-8">
    <Navbar />
    <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Sidebar />
      <main className="pb-10">{children}</main>
    </div>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/test"
      element={
        <ProtectedRoute>
          <AppLayout>
            <TestPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/results"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ResultsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/bookmarks"
      element={
        <ProtectedRoute>
          <AppLayout>
            <BookmarksPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/problems"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProblemsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/problem/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ProblemDetailPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/submissions"
      element={
        <ProtectedRoute>
          <AppLayout>
            <SubmissionsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/coding"
      element={
        <ProtectedRoute>
          <AppLayout>
            <CodingPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/coding-editor/:problemId"
      element={
        <ProtectedRoute>
          <CodingEditor />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/problems"
      element={
        <AdminRoute>
          <AppLayout>
            <AdminProblemsPage />
          </AppLayout>
        </AdminRoute>
      }
    />
  </Routes>
);

export default App;
