import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Kullanıcı adınızı girin"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
