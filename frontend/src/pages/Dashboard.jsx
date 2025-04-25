import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import WebhookForm from '../components/WebhookForm.jsx';
import FeedbackList from '../components/FeedbackList.jsx';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);

  const handleResult = (data) => {
    setFeedbacks((prev) => [data, ...prev]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <h1 className="text-xl font-bold mb-4">Dashboard</h1>
          <WebhookForm onResult={handleResult} />
          <FeedbackList items={feedbacks} />
        </main>
      </div>
    </div>
  );
}
