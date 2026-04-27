import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import {
  ArrowLeft,
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  Loader,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api.js';
import { getAuthData } from '../utils/auth.js';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = getAuthData();

  const [problem, setProblems] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [newSolution, setNewSolution] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchProblemDetails();
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      const problemRes = await API.get(`/problems/${id}`);
      setProblems(problemRes.data.problem);

      const solutionsRes = await API.get(`/solutions/${id}`);
      setSolutions(solutionsRes.data.solutions || []);

      const discussionsRes = await API.get(`/discussions/${id}`);
      setDiscussions(discussionsRes.data.discussions || []);

      const notificationsRes = await API.get('/notifications');
      setNotifications(notificationsRes.data.notifications || []);
    } catch {
      toast.error('Failed to load problem details');
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    open: 'bg-blue-100 text-[#0c2340]',
    'in-progress': 'bg-amber-100 text-[#92400e]',
    completed: 'bg-[#d1fae5] text-[#065f46]'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar user={user} notifications={notifications} />
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar user={user} notifications={notifications} />
        <div className="max-w-[900px] mx-auto w-full px-4 py-10">
          Problem not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar user={user} notifications={notifications} />

      <div className="flex-1 max-w-[900px] mx-auto w-full px-4 py-8">

        {/* Top Buttons */}
        <div className="flex md:flex-col gap-4 items-center mb-8">

          <button
            onClick={() => navigate('/problems')}
            className="inline-flex items-center gap-2 text-[#10b981] hover:text-[#065f46] font-semibold transition hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
            Back to Problems
          </button>

          <button
            onClick={() => navigate(`/tracking/${id}`)}
            className="border border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Clock size={18} />
            Tracking History
          </button>

        </div>

        <div className="flex flex-col gap-8">

          {/* Problem Section */}
          <section className="bg-white border-2 border-[#d1fae5] rounded-xl p-8">

            <div className="flex md:flex-col gap-4 justify-between mb-6">

              <h1 className="text-[2rem] md:text-[1.5rem] font-bold text-[#065f46]">
                {problem.title}
              </h1>

              <span className={`px-4 py-2 rounded-md text-[0.85rem] font-semibold uppercase h-fit ${statusStyles[problem.status]}`}>
                {problem.status === 'in-progress'
                  ? 'In Progress'
                  : problem.status}
              </span>

            </div>

            <div className="grid md:grid-cols-1 grid-cols-3 gap-4 bg-gray-100 rounded-lg p-6 mb-6">

              <div>
                <p className="text-gray-500 text-sm">Posted by</p>
                <p className="font-semibold text-gray-700">
                  {problem.user?.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin size={18} />
                  {problem.location}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Date</p>
                <p className="font-semibold text-gray-700">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>

            {problem.image && (
              <div className="rounded-xl overflow-hidden max-h-[400px] mb-6">
                <img
                  src={problem.image}
                  alt={problem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="pt-6 border-t-2 border-[#d1fae5]">
              <h3 className="text-[#065f46] font-bold mb-4">
                Problem Description
              </h3>

              <p className="text-gray-500 leading-7">
                {problem.description}
              </p>
            </div>

          </section>

          {/* AI Suggestions */}
          <section className="bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] border-2 border-[#10b981] rounded-xl p-8">

            <div className="flex md:flex-col gap-4 justify-between mb-6">

              <h2 className="text-[#065f46] text-xl font-bold">
                AI-Powered Suggestions
              </h2>

              <button
                onClick={async () => {
                  setLoadingAI(true);
                  try {
                    const res = await API.get(`/ai/suggestions/${id}`);
                    setAiSuggestions(res.data.suggestions || []);
                    toast.success('AI suggestions loaded!');
                  } catch {
                    toast.error('Failed to get AI suggestions');
                  } finally {
                    setLoadingAI(false);
                  }
                }}
                className="bg-[#10b981] hover:bg-[#065f46] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                {loadingAI ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb size={18} />
                    Get AI Ideas
                  </>
                )}
              </button>

            </div>

            {aiSuggestions.length > 0 && (
              <div className="grid md:grid-cols-1 grid-cols-2 gap-4">
                {aiSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 border-l-4 border-[#10b981] flex gap-4"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </span>

                    <p className="text-gray-700 leading-6">{item}</p>
                  </div>
                ))}
              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;