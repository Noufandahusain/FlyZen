import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      // Mock user for demo purposes
      setUser({
        id: 'user_test_001',
        firstName: 'Noufanda',
        lastName: 'Husain',
        email: 'nopaaannnnn@gmail.com',
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      setUser({
        id: 'user_test_001',
        firstName: 'John',
        lastName: 'Doe',
        email: email,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// API BASE URL CONTEXT
const ApiContext = createContext<{ baseUrl: string }>({ baseUrl: 'http://10.49.66.71:3000' });

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [baseUrl] = useState('http://10.49.66.71:3000');
  return (
    <ApiContext.Provider value={{ baseUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);