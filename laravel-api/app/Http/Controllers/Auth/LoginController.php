<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Services\AppService;
use App\Models\User;

use Log;

class LoginController extends Controller
{
    protected $appService;

    public function __construct(AppService $appService)
    {
        $this->appService = $appService;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('MyApp')->plainTextToken;
            $user->api_token = $token;
            $user->save();

            return response()->json(['token' => $token]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // auth_check メソッド
    public function auth_check(Request $request)
    {
        // POST リクエストからトークンを取得
        $token = $request->input('token');

        $user = Auth::user();

        //ログインしているかつトークンもある
        if (filled ($user)) {
            if ($user->api_token == $token) {
                return response()->json(['message' => 'Authentication successful', 'auth_check' => true]);
            }
        }

        Auth::logout();
        return response()->json(['message' => 'Authentication failed', 'auth_check' => false]);
    }

    public function getRequestToken(Request $request)
    {
        $callbackUrl = $request->query('callback_url');
        Log::info($callbackUrl);
        if (!$callbackUrl) {
            return response()->json(null, 400); // エラーレスポンス
        }
        return $this->appService->getRequestToken($callbackUrl);
    }

    public function getAccessToken(Request $request)
    {
        $oauthToken = $request->query('oauth_token');
        $oauthTokenSecret = $request->query('oauth_token_secret');
        $oauthVerifier = $request->query('oauth_verifier');

        Log::info($oauthToken, $oauthTokenSecret, $oauthVerifier);

        return $this->appService->getAccessToken($oauthToken, $oauthTokenSecret, $oauthVerifier);
    }
}
