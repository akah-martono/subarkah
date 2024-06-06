---
sidebar_position: 2
---

# Membuat Plugin Fungsionalitas di WordPress

Membuat plugin fungsionalitas adalah cara alternatif dari membuat child theme untuk menambah fungsionalitas pada website bagi pengguna builder themeless seperti Breakdance atau pengguna theme yang belum bisa dibuatkan child themenya seperti Spectra one.

## Siapkan Folder dan File untuk Plugin yang Ingin Dibuat

Langkah awal adalah anda menyiapkan folder dan file yang ingin anda buat dalam folder wp-content/plugins, pada contoh di bawah kita membuat folder ak-functions, lalu membuat file functions.php di dalamnya

```bash
cd wp-content/plugins
mkdir ak-functions
cd ak-functions
nano functions.php
```

Untuk yang tidak bisa mengakses SSH silahkan buat folder dan file tersebut menggunakan file manager dari web panel anda.

Tulis Kode pada File `functions.php`
Lalu isi dengan kode untuk fungsi-fungsi yang ingin anda tambahkan pada WordPress anda, pada bagian atas wajib header comment sebagai berikut:

```
/**
* Plugin Name: YOUR PLUGIN NAME
**/
```

Contoh:
```php
<?php
/**
* Plugin Name: Akah Functionality Plugin
**/

add_action( 'template_redirect', function(){
    global $wp;
    if ( $wp->request == 'test/my-custom-plugin' ) {
        echo 'Hello World!';
        die;
    }
} );
```

## Aktifkan Plugin dan Uji

Setelah itu aktifkan plugin yang baru saja anda buat, lalu uji dengan masuk ke https://websiteanda.com/test/my-custom-plugin

Jika sudah berhasil menampilkan tulisan Hello World! anda bisa menghapus baris ke 6 s/d 12, lalu mulai deh memasukkan fungsi-fungsi tambahan yang biasanya anda masukkan ke file functions.php pada child theme