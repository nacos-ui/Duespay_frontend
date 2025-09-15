import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Plus } from 'lucide-react';
import MainLayout from '../../layouts/mainLayout';
import StatusMessage from '../../components/StatusMessage';
import SubmitButton from '../../components/SubmitButton';
import { useSession } from '../../contexts/SessionContext';
import { usePageTitle } from '../../hooks/usePageTitle';

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { createSession, profile } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  usePageTitle("Create New Session - DuesPay");

  // Generate default session title based on current year
  const getCurrentSessionTitle = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}/${currentYear + 1}`;
  };

  const [formData, setFormData] = useState({
    title: getCurrentSessionTitle(),
    start_date: new Date().toISOString().split('T')[0], // Today's date
    end_date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Session title is required');
      setLoading(false);
      return;
    }

    try {
      const sessionData = {
        title: formData.title.trim(),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      const result = await createSession(sessionData);
      
      if (result.success) {
        setSuccess('Session created successfully!');
        setTimeout(() => {
            window.location.href = '/dashboard/overview';
        }, 1500);
      } else {
        console.log("API error response:", result);
        setError(
          result.error ||
          result.error?.title ||
          result.error?.errors?.detail ||
          'Failed to create session'
        );
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <MainLayout>
      <div className="bg-[#0F111F] min-h-screen pt-16 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard/overview')}
              className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            
            <div className="flex items-center mb-2">
              <div className="bg-purple-600 p-2 rounded-lg mr-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create New Session</h1>
            </div>
            <p className="text-gray-400">
              Set up a new academic session for {profile?.association?.association_name}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#23263A] rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Messages */}
              {error && <StatusMessage type="error" children={error} />}
              {success && <StatusMessage type="success" children={success} />}

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., 2024/2025"
                  className="w-full px-4 py-3 bg-[#0F111F] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  This will be used to identify the academic session
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0F111F] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    className="w-full px-4 py-3 bg-[#0F111F] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-300">Session Dates</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Start and end dates are optional. You can set or update these dates later from the dashboard settings. 
                      If you set an end date, a report will be automatically sent to your email when the session ends.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/overview')}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <SubmitButton
                  loading={loading}
                  loadingText="Creating Session..."
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Create Session
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateSessionPage;