<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    public function index(): JsonResponse
    {
        $notifications = $this->notificationService->getAll();
        $unreadCount = $this->notificationService->unreadCount();

        return response()->json([
            'data'         => NotificationResource::collection($notifications),
            'unread_count' => $unreadCount,
            'meta'         => [
                'current_page' => $notifications->currentPage(),
                'last_page'    => $notifications->lastPage(),
                'total'        => $notifications->total(),
            ],
        ]);
    }

    public function markRead(int $id): JsonResponse
    {
        $notification = $this->notificationService->markRead($id);
        return response()->json(new NotificationResource($notification));
    }

    public function markAllRead(): JsonResponse
    {
        $count = $this->notificationService->markAllRead();
        return response()->json(['message' => "Marked {$count} notifications as read"]);
    }
}
