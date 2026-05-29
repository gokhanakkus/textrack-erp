<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login(array $credentials): array|false
    {
        if (!$token = JWTAuth::attempt($credentials)) {
            return false;
        }
        return $this->tokenResponse($token);
    }

    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'production_manager',
        ]);

        $token = JWTAuth::fromUser($user);
        return $this->tokenResponse($token);
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    public function me(): User
    {
        return JWTAuth::parseToken()->authenticate();
    }

    private function tokenResponse(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => auth()->user(),
        ];
    }
}
