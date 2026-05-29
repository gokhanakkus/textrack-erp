<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $notifications = [
            ['title' => 'Kritik Stok Uyarısı',      'message' => 'Pamuk Lacivert stoku kritik seviyenin altında (80m / 500m eşiği).',        'type' => 'critical_stock',    'is_read' => false],
            ['title' => 'Kritik Stok Uyarısı',      'message' => 'Polyester Gri stoku kritik seviyenin altında (45m / 200m eşiği).',          'type' => 'critical_stock',    'is_read' => false],
            ['title' => 'Sipariş Gecikti',           'message' => 'İpekyol Moda (Abiye Elbise) siparişinin teslim tarihi geçti.',              'type' => 'delayed_order',     'is_read' => false],
            ['title' => 'Sipariş Gecikti',           'message' => 'Vakko Tekstil (Takım Elbise) siparişi 7 gün gecikti.',                      'type' => 'delayed_order',     'is_read' => false],
            ['title' => 'Üretim Duraklatıldı',       'message' => 'Hat-B üretim hattı Twist Moda siparişi için duraklatıldı.',                 'type' => 'production_stopped','is_read' => true ],
            ['title' => 'Kalite Sorunu Tespit Edildi','message' => 'Koton Tekstil Polo ürününden 85 adet renk farkı kontrolünden geçemedi.',   'type' => 'quality_issue',     'is_read' => true ],
            ['title' => 'Kritik Stok Uyarısı',      'message' => 'Denim Siyah stoku kritik seviyenin altında (120m / 400m).',                  'type' => 'critical_stock',    'is_read' => false],
            ['title' => 'Sipariş Gecikti',           'message' => 'Çiçek Tekstil T-Shirt siparişi malzeme eksikliği nedeniyle gecikti.',       'type' => 'delayed_order',     'is_read' => true ],
            ['title' => 'Üretim Tamamlandı',         'message' => 'LC Waikiki T-Shirt üretimi tamamlandı. Kalite kontrole aktarıldı.',          'type' => 'info',              'is_read' => true ],
            ['title' => 'Yeni Sipariş Alındı',       'message' => 'Under Armour TR\'den 3000 adet T-Shirt için yeni sipariş alındı.',           'type' => 'info',              'is_read' => true ],
        ];

        foreach ($notifications as $notif) {
            Notification::create([
                'user_id'  => $admin->id,
                'title'    => $notif['title'],
                'message'  => $notif['message'],
                'type'     => $notif['type'],
                'is_read'  => $notif['is_read'],
            ]);
        }
    }
}
