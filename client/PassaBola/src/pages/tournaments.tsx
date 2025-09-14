import { useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { useAuth } from "../hooks/useAuth.js";

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onRegister: (userData: any) => Promise<{ success: boolean; message?: string }>;
  onSwitchMode: () => void;
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, onSwitchMode, isLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    game: "",
    rank: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Modo Login
      const result = await onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.message || "Erro no login");
      }
    } else {
      // Modo Registro
      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      if (formData.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      const result = await onRegister(formData);
      if (!result.success) {
        setError(result.message || "Erro no cadastro");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Criar Conta"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome completo:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar senha:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required={!isLogin}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 ${
            isLogin 
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
              : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          }`}
        >
          {isLogin ? "Entrar" : "Criar Conta"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onSwitchMode}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isLogin ? "Não tem uma conta? Criar conta" : "Já tem uma conta? Fazer login"}
        </button>
      </div>

      {isLogin && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-medium text-gray-700">Contas de admin:</p>
          <p className="text-xs text-gray-600">Admin: adminteste@gmail.com</p>
        </div>
      )}
    </div>
  );
};

export default function TournamentsPage() {
  const { user, loading, login, register, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-screen py-8">
          <AuthForm 
            onLogin={login}
            onRegister={register}
            onSwitchMode={handleSwitchMode}
            isLogin={isLogin}
          />
        </div>
      </DefaultLayout>
    );
  }

  const isAdmin = user.email.toLowerCase().startsWith("admin");

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-4xl font-bold">🎯 Torneios Femininos</h1>
          <p className="text-lg text-gray-600 mt-4">
            Bem-vinda, {user.name}!
          </p>

          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Sair
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 max-w-lg w-full">
          {isAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-pink-600 mb-3">Administradores</h2>
              <ul className="text-gray-600">
                <li>✅ Criar torneios</li>
                <li>✅ Gerenciar chaveamentos</li>
                <li>✅ Atualizar placares</li>
              </ul>
            </div>
          )}

          {!isAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-green-600 mb-3">Jogadoras</h2>
              <ul className="text-gray-600">
                <li>✅ Inscrever-se em torneios</li>
                <li>✅ Acompanhar partidas</li>
                <li>✅ Ver resultados</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}