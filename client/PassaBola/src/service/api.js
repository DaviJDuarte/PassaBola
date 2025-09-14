import axios from 'axios';


export const api = axios.create({
  baseURL: 'http://localhost:5173',
});


let mockData = {
  users: [
    {
      id: 1,
      email: 'adminteste@gmail.com',
      password: '123456',
      name: 'Administrador',
      role: 'admin'
    },
    {
      id: 2, 
      email: 'jogadora@gmail.com',
      password: '123456',
      name: 'Jogadora Teste',
      role: 'player',
    }
  ],
  tournaments: []
};

api.interceptors.request.use((config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (config.url === '/auth/login' && config.method === 'post') {
        const { email, password } = config.data;
        const user = mockData.users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const response = {
            data: {
              token: 'fake-token-' + user.role,
              user: { ...user, password: undefined }
            }
          };
          resolve({ ...config, data: response });
        } else {
          resolve({ ...config, error: new Error('Credenciais inválidas') });
        }
      } else {
        resolve(config);
      }
    }, 500);
  });
});