<?php

namespace App\Repositories;

use App\Models\Notification;

class NotificationRepository
{
    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function getUnread(int $userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->latest()
            ->take(10)
            ->get();
    }

    public function paginate(int $userId, int $perPage = 20)
    {
        return Notification::where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function markRead(int $id, int $userId): Notification
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();
        $notification->update(['is_read' => true]);
        return $notification;
    }

    public function markAllRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}
