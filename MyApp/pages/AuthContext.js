import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 新しいコンテキストを作成
const AuthContext = createContext();

// AuthProviderというコンポーネントを作成
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ユーザー情報を格納するステート
  const [isLoading, setIsLoading] = useState(true); // ログイン状態の読み込み中かどうかを管理

  // ユーザーのログインを処理する関数
  const login = async (userData) => {
    // ログイン処理（例えば、サーバーにリクエストを送信して認証）
    // 成功したらユーザー情報を設定
    setUser(userData);

    // AsyncStorageにユーザー情報を保存
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  // ユーザーのログアウトを処理する関数
  const logout = async () => {
    // ログアウト処理（例えば、トークンを破棄するなど）
    // ...

    // ユーザー情報をnullに設定
    setUser(null);

    // AsyncStorageからユーザー情報を削除
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  // 初回のアプリ起動時にユーザー情報を読み込む
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false); // 読み込み完了
      }
    };

    loadUser();
  }, []);

  return (
    // AuthContext.Providerを使用してコンテキストを提供
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContextを使用するためのカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};
