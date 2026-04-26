// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar.jsx';
// import { ArrowLeft, ThumbsUp, Lightbulb, MessageSquare, Loader, Clock, MapPin, Star } from 'lucide-react';
// import { toast } from 'react-toastify';
// import API from '../utils/api.js';
// import { getAuthData } from '../utils/auth.js';
// import '../styles/ProblemDetail.css';

// const ProblemDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { user } = getAuthData();
//     const [problem, setProblems] = useState(null);
//     const [solutions, setSolutions] = useState([]);
//     const [discussions, setDiscussions] = useState([]);
//     const [aiSuggestions, setAiSuggestions] = useState([]);
//     const [newSolution, setNewSolution] = useState('');
//     const [newDiscussion, setNewDiscussion] = useState('');
//     const [loadingAI, setLoadingAI] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         fetchProblemDetails();
//     }, [id]);

//     const fetchProblemDetails = async () => {
//         try {
//             const problemRes = await API.get(`/problems/${id}`);
//             setProblems(problemRes.data.problem);

//             const solutionsRes = await API.get(`/solutions/${id}`);
//             setSolutions(solutionsRes.data.solutions || []);

//             const discussionsRes = await API.get(`/discussions/${id}`);
//             setDiscussions(discussionsRes.data.discussions || []);

//             const notificationsRes = await API.get('/notifications');
//             setNotifications(notificationsRes.data.notifications || []);
//         } catch (error) {
//             toast.error('Failed to load problem details');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddSolution = async (e) => {
//         e.preventDefault();

//         if (!newSolution.trim()) {
//             toast.error('Please enter a solution');
//             return;
//         }

//         if (newSolution.length < 10) {
//             toast.error('Solution must be at least 10 characters');
//             return;
//         }

//         try {
//             const response = await API.post(`/solutions/create/${id}`, {
//                 description: newSolution
//             });

//             setSolutions([response.data.solution, ...solutions]);
//             setNewSolution('');
//             toast.success('Solution added successfully!');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to add solution');
//         }
//     };

//     const handleAddDiscussion = async (e) => {
//         e.preventDefault();

//         if (!newDiscussion.trim()) {
//             toast.error('Please enter a message');
//             return;
//         }

//         try {
//             const response = await API.post(`/discussions/create/${id}`, {
//                 message: newDiscussion
//             });

//             setDiscussions([response.data.discussion, ...discussions]);
//             setNewDiscussion('');
//             toast.success('Message added successfully!');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to add message');
//         }
//     };

//     const handleVoteSolution = async (solutionId) => {
//         try {
//             await API.post(`/votes/upvote/${solutionId}`);
//             fetchProblemDetails();
//             toast.success('Vote added!');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to vote');
//         }
//     };

//     const handleGetAISuggestions = async () => {
//         setLoadingAI(true);
//         try {
//             const response = await API.get(`/ai/suggestions/${id}`);
//             setAiSuggestions(response.data.suggestions || []);
//             toast.success('AI suggestions loaded!');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to get AI suggestions');
//         } finally {
//             setLoadingAI(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="problem-detail-layout">
//                 <Navbar user={user} notifications={notifications} />
//                 <div className="loading">
//                     <div className="spinner"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (!problem) {
//         return (
//             <div className="problem-detail-layout">
//                 <Navbar user={user} notifications={notifications} />
//                 <div className="problem-detail-container">
//                     <p>Problem not found</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="problem-detail-layout">
//             <Navbar user={user} notifications={notifications} />

//             <div className="problem-detail-container">
//                 <div className="nav-buttons">
//                     <button 
//                         className="back-button"
//                         onClick={() => navigate('/problems')}
//                     >
//                         <ArrowLeft size={20} />
//                         Back to Problems
//                     </button>
//                     <button 
//                         className="btn-outline"
//                         onClick={() => navigate(`/tracking/${id}`)}
//                     >
//                         <Clock size={18} />
//                         Tracking History
//                     </button>
//                 </div>

//                 <div className="detail-content">
//                     {/* Problem Section */}
//                     <section className="problem-section">
//                         <div className="problem-header">
//                             <div>
//                                 <h1>{problem.title}</h1>
//                                 <span className={`status-badge ${problem.status}`}>
//                                     {problem.status === 'in-progress' ? 'In Progress' : problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="problem-meta">
//                             <div className="meta-item">
//                                 <span className="meta-label">Posted by</span>
//                                 <span className="meta-value">{problem.user?.name}</span>
//                             </div>
//                             <div className="meta-item">
//                                 <span className="meta-label">Location</span>
//                                 <span className="meta-value"><MapPin size={18} className="inline-icon" /> {problem.location}</span>
//                             </div>
//                             <div className="meta-item">
//                                 <span className="meta-label">Date</span>
//                                 <span className="meta-value">{new Date(problem.createdAt).toLocaleDateString()}</span>
//                             </div>
//                         </div>

//                         {problem.image && (
//                             <div className="problem-image">
//                                 <img src={problem.image} alt={problem.title} />
//                             </div>
//                         )}

//                         <div className="problem-description">
//                             <h3>Problem Description</h3>
//                             <p>{problem.description}</p>
//                         </div>
//                     </section>

//                     {/* AI Suggestions Section */}
//                     <section className="ai-suggestions-section">
//                         <div className="section-header">
//                             <h2>AI-Powered Suggestions</h2>
//                             <button 
//                                 className="btn-primary"
//                                 onClick={handleGetAISuggestions}
//                                 disabled={loadingAI}
//                             >
//                                 {loadingAI ? (
//                                     <>
//                                         <Loader size={18} className="spinner-icon" />
//                                         Generating...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Lightbulb size={18} />
//                                         Get AI Ideas
//                                     </>
//                                 )}
//                             </button>
//                         </div>

//                         {aiSuggestions.length > 0 && (
//                             <div className="suggestions-grid">
//                                 {aiSuggestions.map((suggestion, index) => (
//                                     <div key={index} className="suggestion-card">
//                                         <span className="suggestion-number">{index + 1}</span>
//                                         <p>{suggestion}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </section>

//                     {/* Solutions Section */}
//                     <section className="solutions-section">
//                         <div className="section-header">
//                             <h2>Solutions ({solutions.length})</h2>
//                         </div>

//                         <div className="add-solution">
//                             <h3>Suggest a Solution</h3>
//                             <form onSubmit={handleAddSolution}>
//                                 <textarea
//                                     value={newSolution}
//                                     onChange={(e) => setNewSolution(e.target.value)}
//                                     placeholder="Share your solution idea for this problem..."
//                                     rows="3"
//                                     className="form-textarea"
//                                 ></textarea>
//                                 <button type="submit" className="btn-primary">
//                                     Add Solution
//                                 </button>
//                             </form>
//                         </div>

//                         {solutions.length > 0 ? (
//                             <div className="solutions-list">
//                                 {solutions.map(solution => (
//                                     <div key={solution._id} className="solution-card">
//                                         <div className="solution-header">
//                                             <div className="solution-rank">
//                                                 {solution.isBestSolution && (
//                                                     <span className="best-badge"><Star size={16} fill="currentColor" className="inline-icon" /> Best Solution</span>
//                                                 )}
//                                                 <span className="rank">Rank #{solution.rank}</span>
//                                             </div>
//                                         </div>

//                                         <p className="solution-text">{solution.description}</p>

//                                         <div className="solution-meta">
//                                             <span>By: {solution.user?.name}</span>
//                                             <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
//                                         </div>

//                                         <button 
//                                             className="vote-btn"
//                                             onClick={() => handleVoteSolution(solution._id)}
//                                         >
//                                             <ThumbsUp size={18} />
//                                             {solution.votes} Votes
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="no-items-with-image">
//                                 <img
//                                     src="https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=1000&q=80"
//                                     alt="No solutions yet"
//                                 />
//                                 <p className="no-items">No solutions yet. Be the first to suggest one!</p>
//                             </div>
//                         )}
//                     </section>

//                     {/* Discussions Section */}
//                     <section className="discussions-section">
//                         <div className="section-header">
//                             <h2>Discussions ({discussions.length})</h2>
//                         </div>

//                         <div className="add-discussion">
//                             <h3>Join the Discussion</h3>
//                             <form onSubmit={handleAddDiscussion}>
//                                 <textarea
//                                     value={newDiscussion}
//                                     onChange={(e) => setNewDiscussion(e.target.value)}
//                                     placeholder="Share your thoughts or ask questions..."
//                                     rows="3"
//                                     className="form-textarea"
//                                 ></textarea>
//                                 <button type="submit" className="btn-primary">
//                                     <MessageSquare size={18} />
//                                     Post Message
//                                 </button>
//                             </form>
//                         </div>

//                         {discussions.length > 0 ? (
//                             <div className="discussions-list">
//                                 {discussions.map(discussion => (
//                                     <div key={discussion._id} className="discussion-card">
//                                         <div className="discussion-header">
//                                             <strong>{discussion.user?.name}</strong>
//                                             <span className="text-muted">{new Date(discussion.createdAt).toLocaleDateString()}</span>
//                                         </div>
//                                         <p className="discussion-text">{discussion.message}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="no-items-with-image">
//                                 <img
//                                     src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80"
//                                     alt="No discussions yet"
//                                 />
//                                 <p className="no-items">No discussions yet. Start the conversation!</p>
//                             </div>
//                         )}
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProblemDetail;


// ProblemDetail.jsx (Tailwind Converted - Colors Preserved)

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