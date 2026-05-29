<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['name' => 'LC Waikiki A.Ş.',       'contact_person' => 'Ahmet Yıldız',   'email' => 'tedarik@lcwaikiki.com',   'phone' => '0212 555 01 01', 'city' => 'İstanbul', 'tax_no' => '1234567890'],
            ['name' => 'Koton Tekstil',           'contact_person' => 'Selin Kaya',     'email' => 'uretim@koton.com',        'phone' => '0212 555 02 02', 'city' => 'İstanbul', 'tax_no' => '2345678901'],
            ['name' => 'Mavi Giyim',              'contact_person' => 'Burak Demir',    'email' => 'siparis@mavi.com',        'phone' => '0216 555 03 03', 'city' => 'İstanbul', 'tax_no' => '3456789012'],
            ['name' => 'Defacto Perakende',       'contact_person' => 'Ayşe Çelik',    'email' => 'tedarik@defacto.com',     'phone' => '0212 555 04 04', 'city' => 'İzmir',    'tax_no' => '4567890123'],
            ['name' => 'H&M Türkiye',             'contact_person' => 'Mert Aksoy',     'email' => 'supply@hm.com.tr',        'phone' => '0212 555 05 05', 'city' => 'İstanbul', 'tax_no' => '5678901234'],
            ['name' => 'Zara Türkiye',            'contact_person' => 'Ceren Yılmaz',   'email' => 'uretim@zara.com.tr',      'phone' => '0212 555 06 06', 'city' => 'İstanbul', 'tax_no' => '6789012345'],
            ['name' => 'Bershka Perakende',       'contact_person' => 'Enes Şahin',     'email' => 'siparis@bershka.com.tr',  'phone' => '0216 555 07 07', 'city' => 'Ankara',   'tax_no' => '7890123456'],
            ['name' => 'Pull&Bear Mağazaları',    'contact_person' => 'Derya Kılıç',   'email' => 'tedarik@pullbear.com',    'phone' => '0212 555 08 08', 'city' => 'İstanbul', 'tax_no' => '8901234567'],
            ['name' => 'Stradivarius Türkiye',    'contact_person' => 'Gizem Arslan',   'email' => 'uretim@stradivarius.com', 'phone' => '0212 555 09 09', 'city' => 'İstanbul', 'tax_no' => '9012345678'],
            ['name' => 'Massimo Dutti TR',        'contact_person' => 'Kemal Öztürk',  'email' => 'siparis@massimodutti.com','phone' => '0212 555 10 10', 'city' => 'İstanbul', 'tax_no' => '0123456789'],
            ['name' => 'Boyner Mağazaları',       'contact_person' => 'Pınar Aydın',   'email' => 'tedarik@boyner.com.tr',   'phone' => '0216 555 11 11', 'city' => 'İstanbul', 'tax_no' => '1122334455'],
            ['name' => 'Network Moda',            'contact_person' => 'Tolga Başaran',  'email' => 'uretim@network.com.tr',   'phone' => '0312 555 12 12', 'city' => 'Ankara',   'tax_no' => '2233445566'],
            ['name' => 'Marks & Spencer TR',      'contact_person' => 'Berna Koç',     'email' => 'supply@marksandspencer.tr','phone' => '0212 555 13 13', 'city' => 'İstanbul', 'tax_no' => '3344556677'],
            ['name' => 'Tommy Hilfiger TR',       'contact_person' => 'Selim Güven',    'email' => 'tedarik@tommy.com.tr',    'phone' => '0212 555 14 14', 'city' => 'İstanbul', 'tax_no' => '4455667788'],
            ['name' => 'Calvin Klein TR',         'contact_person' => 'İrem Toprak',   'email' => 'siparis@calvinklein.tr',  'phone' => '0212 555 15 15', 'city' => 'İstanbul', 'tax_no' => '5566778899'],
            ['name' => 'Levi\'s Türkiye',         'contact_person' => 'Alp Ergün',      'email' => 'uretim@levis.com.tr',     'phone' => '0216 555 16 16', 'city' => 'İzmir',    'tax_no' => '6677889900'],
            ['name' => 'Nike Türkiye',            'contact_person' => 'Zeynep Polat',   'email' => 'supply@nike.com.tr',      'phone' => '0212 555 17 17', 'city' => 'İstanbul', 'tax_no' => '7788990011'],
            ['name' => 'Adidas TR',               'contact_person' => 'Okan Şimşek',   'email' => 'tedarik@adidas.com.tr',   'phone' => '0212 555 18 18', 'city' => 'İstanbul', 'tax_no' => '8899001122'],
            ['name' => 'Ipekyol Moda',            'contact_person' => 'Hande Doğan',   'email' => 'siparis@ipekyol.com.tr',  'phone' => '0212 555 19 19', 'city' => 'İstanbul', 'tax_no' => '9900112233'],
            ['name' => 'Vakko Tekstil',           'contact_person' => 'Serkan Uysal',   'email' => 'uretim@vakko.com.tr',     'phone' => '0212 555 20 20', 'city' => 'İstanbul', 'tax_no' => '1011121314'],
            ['name' => 'Twist Moda',              'contact_person' => 'Elif Karahan',   'email' => 'tedarik@twist.com.tr',    'phone' => '0216 555 21 21', 'city' => 'Bursa',    'tax_no' => '1112131415'],
            ['name' => 'Çiçek Tekstil',           'contact_person' => 'Murat Tuncer',   'email' => 'siparis@cicektekstil.com','phone' => '0224 555 22 22', 'city' => 'Bursa',    'tax_no' => '1213141516'],
            ['name' => 'Atlas Tekstil',           'contact_person' => 'Nilüfer Acar',  'email' => 'uretim@atlastekstil.com', 'phone' => '0322 555 23 23', 'city' => 'Adana',    'tax_no' => '1314151617'],
            ['name' => 'Puma TR',                 'contact_person' => 'Barış Yaman',   'email' => 'supply@puma.com.tr',      'phone' => '0212 555 24 24', 'city' => 'İstanbul', 'tax_no' => '1415161718'],
            ['name' => 'Under Armour TR',         'contact_person' => 'Gökhan Çetin',  'email' => 'tedarik@underarmour.tr',  'phone' => '0212 555 25 25', 'city' => 'İstanbul', 'tax_no' => '1516171819'],
        ];

        foreach ($customers as $data) {
            $customer = Customer::create($data);

            // Mevcut siparişlerde aynı isim varsa customer_id'yi bağla
            Order::where('customer_name', $data['name'])
                 ->update(['customer_id' => $customer->id]);
        }
    }
}
