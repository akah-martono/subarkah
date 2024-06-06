---
sidebar_position: 1
---
# Mendapatkan URL Path Saat Ini di WordPress


## URL Full
URL full adalah URL lengkap yang terdiri dari protokol (http/https), host (biasa disebut domain), path, dan query string. URL full ini bisa anda lihat di address bar pada browser.

Contoh:
```
https://www.subarkah.com/test/my-current-path/?par1=abc&par2=def
```

Mendapatkan URL Full dengan Vanilla PHP
```php 
function get_current_path() {
    if ( ( isset($_SERVER['HTTPS'] ) && ( $_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1 ) ) || 
    ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' )
    ) {
        $proto = 'https://';
    } else {
        $proto = 'http://';
    }

    return $proto . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
}

echo get_current_path();
```
Output:
```
https://www.subarkah.com/test/my-current-path/?par1=abc&par2=def
```

Mendapatkan URL Full dengan WordPress
```php
echo home_url( $_SERVER['REQUEST_URI'] );
```

Output:
```
https://www.subarkah.com/test/my-current-path/?par1=abc&par2=def
```
Dari kode di atas kita bisa melihat bahwa untuk mendapatkan full path dengan memanfaatkan fungsi home_url() pada WordPress kode yang diketik lebih sedikit daripada membuatnya dengan vanilla PHP, silahkan pilih yang anda suka. Untuk perbandingan performanya saya belum pernah test, jika anda ada waktu untuk mengetestnya silahkan share hasilnya di komen.

## URL Relative

URL relative adalah URL full tanpa protokol dan host.

Contoh:
```
/test/my-current-path/?par1=abc&par2=def
```

Mendapatkan URL Relative dengan Vanilla PHP
```php
echo $_SERVER['REQUEST_URI'];
```

Output:
```
/test/my-current-path/?par1=abc&par2=def
```

Mendapatkan URL Relative dengan WordPress
```php
$url = 'https://www.subarkah.com/test/my-current-path/?par1=abc&par2=def';
echo wp_make_link_relative( $url );
```

Output:
```
/test/my-current-path/?par1=abc&par2=def
```

Untuk mendapatkan full relative path yang aktif pada dasarnya hanya perlu $_SERVER[‘REQUEST_URI’], adapun fungsi wp_make_link_relative() pada WordPress lebih cocok jika anda sudah memiliki data urlnya, dan akan lebih bermanfaat lagi jika data url tersebut lebih dari satu (misal dalam array atau dalam query loop). berikut contohnya:

```php
$urls = [url1, url2, ...];
$rel_urls = [];
foreach( $urls as $url ){
    $rel_urls[] = wp_make_link_relative( $url );
}
```

## URL Path

URL path adalah URL relative tanpa query string.

Contoh:
```
/test/my-current-path/
```

Mendapatkan URL Path dengan Vanilla PHP
```php
echo explode( '?', $_SERVER['REQUEST_URI'], 2 )[0];
```

Output:
```
/test/my-current-path/
```

Mendapatkan URL Path dengan WordPress
```php
global $wp;
echo $wp->request;
```

Output:
```
test/my-current-path
```

Seperti yang anda lihat, untuk mendapatkan relative path lebih mudah menggunakan WordPress, dengan output yang selalu tanpa trailing slash (“/”) di awal dan di akhir maka akan lebih konsisten saat kita akan menggunakannya sebagai sebuah kondisi.