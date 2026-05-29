<?php

namespace App\Services;

use App\Models\Notification;
use App\Repositories\NotificationRepository;

class NotificationService
{
    public function __construct(private NotificationRepository $repo) {}

    public function create(array $data): Notification
    {
        $data['user_id'] = auth()->id();
        return $this->repo->create($data);
    }

    public function getUnread()
    {
        return $this->repo->getUnread(auth()->id());
    }

    public function getAll(int $perPage = 20)
    {
        return $this->repo->paginate(auth()->id(), $perPage);
    }

    public function markRead(int $id): Notification
    {
        return $this->repo->markRead($id, auth()->id());
    }

    public function markAllRead(): int
    {
        return $this->repo->markAllRead(auth()->id());
    }

    public function unreadCount(): int
    {
        return $this->repo->unreadCount(auth()->id());
    }
}
