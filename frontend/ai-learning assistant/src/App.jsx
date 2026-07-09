import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";

import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage";
import FlashCardPage from "./pages/Flashcards/FlashcardPage";

import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";

import ProfilePage from "./pages/Profile/ProfilePage";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/documents" element={<DocumentListPage />} />

          <Route
            path="/documents/:id"
            element={<DocumentDetailPage />}
          />

          <Route
            path="/flashcards"
            element={<FlashcardsListPage />}
          />

          <Route
            path="/documents/:id/flashcards"
            element={<FlashCardPage />}
          />

          <Route
            path="/quizzes/:quizId"
            element={<QuizTakePage />}
          />

          <Route
            path="/quizzes/:quizId/results"
            element={<QuizResultPage />}
          />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};