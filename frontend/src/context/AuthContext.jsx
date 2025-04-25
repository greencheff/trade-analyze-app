// frontend/src/pages/Auth.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { login } = useAuth();
  const [email, setEmail] = useState("test@demo.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Geçersiz e-posta veya şifre");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Giriş Yap</h2>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        <label className="block mb-2">E-posta</label>
        <input
          className="input w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Şifre</label>
        <input
          type="password"
          className="input w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Giriş Yap
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          Test Kullanıcı: <br />
          <span className="font-mono">test@demo.com / 123456</span>
        </p>
      </form>
    </div>
  );
}
