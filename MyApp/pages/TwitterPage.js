import React, {useState} from "react";
import { Button, Alert } from "react-native";
import {
  useAuthRequest,
  CodeChallengeMethod,
  ResponseType,
  makeRedirectUri,
} from "expo-auth-session";
import pkceChallenge from "react-native-pkce-challenge";

export default function TwitterLogin() {
  const [requestToken, setRequestToken] = useState(null);
  const { codeChallenge, codeVerifier } = pkceChallenge();

  // バックエンドエンドポイントのURL
  const backendUrl = 'http://35.79.230.186/laravel-api/api'; // 実際のバックエンドのURLに置き換えてください

  const getRequestToken = async () => {
    try {
      const redirectUri = 'https://auth.expo.io/@asulab_yuuki/MyApp';
      const response = await axios.get(`${backendUrl}/request-token`, {
        params: { callback_url: redirectUri },
      });
      setRequestToken(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get request token');
    }
  };

  const discovery = {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://twitter.com/i/oauth2/token",
    revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      clientSecret, // 実際にはフロントエンドに含めるべきではない
      redirectUri:  'https://auth.expo.io/@asulab_yuuki/MyApp',
      usePKCE: true,
      scopes: ["tweet.read", "users.read", "offline.access"],
      responseType: ResponseType.Code,
      codeChallengeMethod: CodeChallengeMethod.S256,
      codeChallenge,
    },
    discovery
  );
  


  const handlePress = async () => {
    const tokenData = await getRequestToken();
    if (!tokenData) return;

    const { oauth_token } = tokenData;
    const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    const redirectUri = 'https://auth.expo.io/@asulab_yuuki/MyApp';

    // const response = await AuthSession.startAsync({ authUrl, returnUrl: redirectUri });
    // if (response.type === 'success' && response.params.oauth_verifier) {
    //   const { oauth_verifier } = response.params;
    //   const accessTokenResponse = await axios.get(`${backendUrl}/access-token`, {
    //     params: {
    //       oauth_token: oauth_token,
    //       oauth_token_secret: requestToken.oauth_token_secret, // 保存されているリクエストトークンの秘密鍵
    //       oauth_verifier: oauth_verifier,
    //     },
    //   });

    //   // アクセストークンを使用した処理（例：ユーザー情報の取得）
    //   console.log(accessTokenResponse.data);
    // } else {
    //   Alert.alert('Authentication failed');
    // }
  };

  return (
    <Button title="Login with Twitter" onPress={handlePress} />
  );
}
