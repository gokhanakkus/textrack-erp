<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User',       'email' => 'admin@textrack.com',     'role' => 'admin'],
            ['name' => 'Ahmet Yılmaz',     'email' => 'manager@textrack.com',   'role' => 'production_manager'],
            ['name' => 'Mehmet Demir',     'email' => 'warehouse@textrack.com', 'role' => 'warehouse_staff'],
            ['name' => 'Ayşe Kaya',        'email' => 'qc@textrack.com',        'role' => 'quality_control'],
        ];

        foreach ($users as $user) {
            User::create([
                'name'     => $user['name'],
                'email'    => $user['email'],
                'password' => Hash::make('password'),
                'role'     => $user['role'],
            ]);
        }
    }
}
