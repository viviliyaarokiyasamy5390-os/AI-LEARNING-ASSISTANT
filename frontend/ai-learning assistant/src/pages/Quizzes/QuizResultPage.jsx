import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

const QuizResultPage = () => {

  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
        console.log(data);
console.log(JSON.stringify(data.data.results[0], null, 2));
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!results ||!results.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const { data: { quiz, results: detailedResults } } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good work!';
    if (score >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to={`/documents/${quiz.document._id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            Back to Document
          </Link>
        </div>

        <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-6">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <div>
              <p className="text-slate-500 text-lg mb-2">
                Your Score
              </p>
              <div className={`inline-block text-6xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-3`}>
                {score}%
              </div>
              <p className="text-2xl font-semibold text-slate-700">
                {getScoreMessage(score)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200">
            <Target className="w-8 h-8 text-slate-500 mx-auto mb-2" strokeWidth={2} />
            <span className="text-2xl font-bold text-slate-800 block">
              {totalQuestions}
            </span>
            <span className="text-sm text-slate-500">Total</span>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" strokeWidth={2} />
            <span className="text-2xl font-bold text-emerald-600 block">
              {correctAnswers}
            </span>
            <span className="text-sm text-slate-500">Correct</span>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200">
            <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" strokeWidth={2} />
            <span className="text-2xl font-bold text-rose-600 block">
              {incorrectAnswers}
            </span>
            <span className="text-sm text-slate-500">Incorrect</span>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-slate-700" strokeWidth={2} />
            <h3 className="text-xl font-bold text-slate-800">Detailed Review</h3>
          </div>

         {detailedResults.map((result, index) => {
  const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
  
  // Robust correctAnswer check
  let correctAnswerIndex = result.options.findIndex(opt => opt === result.correctAnswer);
  
  // If text match failed, try as index "0", "1" etc
  if (correctAnswerIndex === -1 && !isNaN(result.correctAnswer)) {
    const idx = parseInt(result.correctAnswer);
    if (idx >= 0 && idx < result.options.length) correctAnswerIndex = idx;
  }
  
  // If still failed, try as "A", "B", "C"
  if (correctAnswerIndex === -1 && typeof result.correctAnswer === 'string' && result.correctAnswer.length === 1) {
    const letterIdx = result.correctAnswer.toUpperCase().charCodeAt(0) - 65;
    if (letterIdx >= 0 && letterIdx < result.options.length) correctAnswerIndex = letterIdx;
  }
  
  const isCorrect = result.isCorrect || userAnswerIndex === correctAnswerIndex;

  return (
    <div key={index} className="mb-8 last:mb-0 p-6 rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
              Question {index + 1}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-slate-800">
            {result.question}
          </h4>
        </div>

        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isCorrect
           ? 'bg-emerald-50 border-2 border-emerald-200'
            : 'bg-rose-50 border-2 border-rose-200'
        }`}>
          {isCorrect? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-6 h-6 text-rose-600" strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div className="space-y-3">
        {result.options.map((option, optIndex) => {
          const isCorrectOption = optIndex === correctAnswerIndex;
          const isUserAnswer = optIndex === userAnswerIndex;
          const isWrongAnswer = isUserAnswer && !isCorrect;

          return (
            <div
              key={optIndex}
              className={`relative px-4 py-4 rounded-lg border-2 transition-all duration-200 ${
                isCorrectOption
                 ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                  : isWrongAnswer
                   ? 'bg-rose-50 border-rose-300'
                    : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-medium ${
                  isCorrectOption
                   ? 'text-emerald-900'
                    : isWrongAnswer
                     ? 'text-rose-900'
                      : 'text-slate-700'
                }`}>
                  {option}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {isCorrectOption && (
                    <span className="flex items-center gap-1 text-emerald-700 text-xs font-semibold px-2 py-1 bg-emerald-100 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Correct
                    </span>
                  )}
                  {isUserAnswer && (
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                      isCorrect 
                       ? 'text-emerald-700 bg-emerald-100' 
                        : 'text-rose-700 bg-rose-100'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> : <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />}
                      Your Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {result.explanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <div className="shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Explanation
              </p>
              <p className="text-sm text-blue-800">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
})}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link to={`/documents/${quiz.document._id}`}>
            <button className="group relative px-8 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Document
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage;
