<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Str;

class AppService
{
    private $client;
    private $consumerKey;
    private $consumerSecret;

    public function __construct()
    {
        $this->client = new Client();
        $this->consumerKey = env('TWITTER_CONSUMER_KEY');
        $this->consumerSecret = env('TWITTER_CONSUMER_SECRET');
    }

    public function getRequestToken(string $callbackUrl)
    {
        $httpMethod = 'POST';
        $url = 'https://api.twitter.com/oauth/request_token';

        // OAuth パラメータの準備
        $params = [
            'oauth_callback' => $callbackUrl,
            'oauth_consumer_key' => $this->consumerKey,
            'oauth_nonce' => Str::random(32), // Laravel 6.x以前ではstr_random、Laravel 7.x以降ではIlluminate\Support\Str::random()を使用
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => time(),
            'oauth_version' => '1.0',
        ];

        // 署名の生成（この部分は具体的な署名生成ロジックに置き換える必要があります）
        $params['oauth_signature'] = $this->generateSignature($params, $httpMethod, $url);

        // Authorization ヘッダーの構築
        $authorizationHeader = $this->buildAuthorizationHeader($params);

        // Guzzle クライアントの設定
        $response = $this->client->post('https://api.twitter.com/oauth/request_token', [
            'headers' => [
                'Authorization' => $authorizationHeader,
            ],
        ]);

        $body = (string) $response->getBody();
        parse_str($body, $result);

        return $result;
    }

    public function getAccessToken(string $oauthToken, string $oauthTokenSecret, string $oauthVerifier)
    {
        $response = $this->client->post('https://api.twitter.com/oauth/access_token', [
            'auth' => [$this->consumerKey, $this->consumerSecret],
            'form_params' => [
                'oauth_token' => $oauthToken,
                'oauth_verifier' => $oauthVerifier,
            ],
        ]);

        $body = (string) $response->getBody();
        parse_str($body, $result);

        return $result;
    }

    private function generateSignature(array $params, string $httpMethod, string $url)
    {
        // コンシューマーシークレットとトークンシークレットを取得します。
        // トークンシークレットはアクセストークン取得リクエストの場合に使用し、
        // リクエストトークン取得の場合は空文字列です。
        $consumerSecret = $this->consumerSecret;
        $tokenSecret = ''; // リクエストトークン取得時は空文字列

        // パラメータをソートし、クエリ文字列形式に変換します。
        uksort($params, 'strcmp');
        $queryString = http_build_query($params, '', '&', PHP_QUERY_RFC3986);

        // 署名ベース文字列を構築します。
        $signatureBaseString = strtoupper($httpMethod) . '&' . rawurlencode($url) . '&' . rawurlencode($queryString);

        // 署名キーを構築します。
        $signingKey = rawurlencode($consumerSecret) . '&' . rawurlencode($tokenSecret);

        // HMAC-SHA1署名を計算し、Base64エンコードします。
        $signature = base64_encode(hash_hmac('sha1', $signatureBaseString, $signingKey, true));

        return $signature;
    }

    protected function buildAuthorizationHeader(array $params)
    {
        // パラメータを "key="value"" の形式に変換し、カンマで連結する
        $headerParts = [];
        foreach ($params as $key => $value) {
            $headerParts[] = $key . '="' . rawurlencode($value) . '"';
        }
        $header = 'OAuth ' . implode(', ', $headerParts);

        return $header;
    }

}
