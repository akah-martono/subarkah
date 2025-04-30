---
sidebar_position: 3
---

# Add WordPress Site

Di tutorial ini kita akan menambahkan website dengan domain mitra.web.id

## Create User
Buat user untuk website yang ingin kita buat
```bash
sudo useradd mitra
```

Masukkan user tersebut ke group www-data
```bash
sudo usermod -a -G mitra www-data
```

## Create Folder
Buat folder untuk website yang ingin kita buat
```bash
sudo mkdir -p /home/mitra/domain.com/public
sudo mkdir -p /home/mitra/domain.com/logs
```

Jadikan user yang kita buat sebelumnya sebagai pemilik folder
```bash
sudo chown -R mitra:mitra /home/mitra
```

Ganti _mitra_ dengan user yang ingin dibuat
Ganti _domain.com_ dengan domai yang ingin digunakan

## Remove/Rename Default PHP-FPM Pool

Jika masih ada default pool, dihapus/rename saja
```bash
sudo mv /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.bak
```

## Create PHP-FPM Pool Config
Buat file PHP-FPM pool menggunakan nano
```bash
sudo nano /etc/php/8.3/fpm/pool.d/mitra.conf
```

Isi dengan config berikut:
```ssh_conf
[mitra]
user = mitra
group = mitra

listen = /run/php/php-mitra.sock

listen.owner = www-data
listen.group = www-data

pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3

php_admin_value[memory_limit] = 256M
php_admin_value[upload_max_filesize] = 64M
php_admin_value[post_max_size] = 64M
php_admin_value[opcache.enable_file_override] = 1
php_admin_value[disable_functions] = exec,passthru,shell_exec,system
```

Simpan dengan Ctrl+O lalu keluar editor dengan Ctrl+X

## Restart PHP-FPM
Periksa apakah konfigurasi yang kita ubah aman:
```bash
sudo php-fpm8.3 -t
```
Jika aman, restart:
```bash
sudo service php8.3-fpm restart
```

## Get SSL certificate
Sebelum request certificate pastikan A record pada domain sudah diarahkan ke IP VPS
Buat sertifikat let's encrypt:
```bash
sudo certbot --nginx certonly -d mitra.web.id -d www.mitra.web.id
```

## Add nginx Config for New Site
Buat konfigurasi nginx untuk website yang ingin dibuat:
```bash
sudo nano /etc/nginx/sites-available/mitra.web.id
```

Isi dengan konfigurasi berikut:
```ssh_config
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name www.mitra.web.id;

    ssl_certificate /etc/letsencrypt/live/mitra.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mitra.web.id/privkey.pem;

    access_log /home/mitra/mitra.web.id/logs/access.log;
    error_log /home/mitra/mitra.web.id/logs/error.log;

    root /home/mitra/mitra.web.id/public/;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php-mitra.sock;
        fastcgi_index index.php;
        include fastcgi.conf;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name mitra.web.id;

    ssl_certificate /etc/letsencrypt/live/mitra.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mitra.web.id/privkey.pem;

    return 301 https://www.mitra.web.id$request_uri;
}

server {
    listen 80;
    listen [::]:80;

    server_name mitra.web.id www.mitra.web.id;

    return 301 https://www.mitra.web.id$request_uri;
}
```

Buat symlink ke sites-enabled
```bash
sudo ln -s /etc/nginx/sites-available/mitra.web.id /etc/nginx/sites-enabled/mitra.web.id
```

## Restart nginx
Periksa apakah konfigurasi yang kita ubah aman
```bash
sudo nginx -t
```
Jika aman, restart
```bash
sudo service nginx restart
```

## Access MariaDB
Log in to the MariaDB database server.
```bash
sudo mariadb -u root -p
```
masukkan password yang sudah dibuat sebelumnya


Create database
```sql
CREATE DATABASE mitra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
```

Create user
```sql
CREATE USER 'mitra_user'@'localhost' IDENTIFIED BY 'Workshop@WPBogor2025';
```

Grant privilege
```sql
GRANT ALL PRIVILEGES ON mitra_db.* TO 'mitra_user'@'localhost';
```

Flush/refresh privileges
```sql
FLUSH PRIVILEGES;
```

Keluar dari MariaDB
```sql
exit;
```

## Ganti user dan pindah ke folder WordPress
Ganti user dengan pemilik website
```bash
sudo su mitra
```

Pindah ke folder website yang telah dibuat sebelumnya
```bash
cd /home/mitra/mitra.web.id/public
```


## Download WordPress
Download WordPress terbaru
```bash
wp core download
```

Konfigure database
```bash
wp core config --dbname=mitra_db --dbuser=mitra_user --dbpass='Workshop@WPBogor2025'
```

Install WordPress
```bash
wp core install --skip-email --url=https://www.mitra.web.id --title='Workshop WPBogor' --admin_user=akah --admin_email=akah@wpbogor.org --admin_password='password'
```

Uninstall Plugin dan Theme yang tidak diperlukan
```bash
wp plugin delete akismet
wp plugin delete hello
wp theme delete twentytwentyfour
wp theme delete twentytwentythree
```