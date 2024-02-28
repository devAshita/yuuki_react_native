<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

use App\Models\UserPost;

use Log;

class ImageController extends Controller
{
    public function image_post(Request $request)
    {
        Log::info($request);
        if ($request->hasFile('image')) {
            $user = Auth::user();
            Log::info($user);

            $image = $request->file('image');
            $path = $image->store('public/images'); // 'storage/app/public/images'に保存
            Log::info('Uploaded File Name: ' . $image->getClientOriginalName());
            Log::info('File Size: ' . $image->getSize());
            Log::info('MIME Type: ' . $image->getMimeType());

            $user_post = UserPost::create([
                'user_id' => $user->id,
                'img_url' => $path,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'address' => $request->address,
            ]);
    
            return response()->json(['message' => 'Image uploaded successfully', 'path' => $path]);
        } else {
            return response()->json(['message' => 'No image uploaded']);
        }
    }

    public function list(Request $request)
    {
        Log::info('List get');

        $user = Auth::user();

        $user_posts = UserPost::where('user_id', $user->id)->get();
    
        $data = [];

        $data['user_posts'] = $user_posts;

        return response()->json($data);
    }
}
