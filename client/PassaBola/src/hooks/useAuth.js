import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@torneios.com' && password === 'admin123') {
      const userData = { 
        id: 1, 
        name: 'Administrador', 
        email: 'admin@torneios.com',
        role: 'admin'
      };
      localStorage.setItem('authToken', 'fake-token-admin');
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    
    if (email === 'jogadora@email.com' && password === '123456') {
      const userData = { 
        id: 2, 
        name: 'Jogadora Teste', 
        email: 'jogadora@email.com',
        role: 'player',
        game: 'Valorant',
        rank: 'Diamante'
      };
      localStorage.setItem('authToken', 'fake-token-player');
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    
    return { success: false, message: 'Credenciais inválidas' };
  };

  // ✅ FUNÇÃO DE REGISTRO ADICIONADA
  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simula cadastro bem-sucedido
    const newUser = {
      id: Date.now(), // ID único baseado no timestamp
      name: userData.name,
      email: userData.email,
      role: 'player', // Todos os registros são jogadoras
      game: userData.game || 'Não informado',
      rank: userData.rank || 'Não informado'
    };
    
    localStorage.setItem('authToken', 'fake-token-new-user');
    localStorage.setItem('userData', JSON.stringify(newUser));
    setUser(newUser);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // ✅ RETORNA A FUNÇÃO register TAMBÉM
  return { user, loading, login, register, logout };
};