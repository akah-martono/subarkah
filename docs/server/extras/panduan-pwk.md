---
sidebar_position: 3
---

# Panduan Setup Web Server Website PWK

## Persyaratan
Sebelum mulai, pastikan telah memiliki:
- Server Ubuntu 24.04 (VPS/dedicated)
- Akses root atau user dengan sudo
- DNS Record bpk.go.id dan *.bpk.go.id sudah mengarah ke IP server

## Install Web Server
### nginx
Gunakan repo nginx dari Ondřej Surý
```bash
sudo add-apt-repository ppa:ondrej/nginx -y
sudo apt update
```

Install nginx
```bash
sudo apt install nginx -y
```

Konfirmasi bahwa nginx telah terinstal
```bash
nginx -v
```

Konfigurasi nginx
```bash
Buka nginx.conf
sudo nano /etc/nginx/nginx.conf
```

Isi dengan konfigurasi berikut
```bash
user www-data;
worker_processes 1; # sesuaikan dengan jumlah core CPU
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;
 
events {
        worker_connections 1024; # sesuaikan dengan open file limit
        multi_accept on;
}
 
http {
    # webp map
    map $http_accept $webp_suffix{
        default "";
        "~*webp" ".webp";
    }
    
    ##
    # Basic Settings
    ##
 
    keepalive_timeout 15;
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;    
    client_max_body_size 64m;
    server_tokens off;
 
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
 
    ##
    # SSL Settings
    ##
 
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;
 
    ##
    # Logging Settings
    ##
 
    access_log /var/log/nginx/access.log;
 
    ##
    # Gzip Settings
    ##
 
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
 
    ##
    # Virtual Host Configs
    ##
 
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### PHP 8.3
Gunakan repo PHP 8.3 dari Ondřej Surý
```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

Install PHP 8.3 beserta paket-paket yang dibutuhkan oleh WordPress
```bash
sudo apt install php8.3-fpm php8.3-common php8.3-mysql \
php8.3-xml php8.3-intl php8.3-curl php8.3-gd \
php8.3-imagick php8.3-cli php8.3-dev php8.3-imap \
php8.3-mbstring php8.3-opcache php8.3-redis \
php8.3-soap php8.3-zip -y
```

Konfirmasi bahwa PHP 8.3 telah terinstal
```bash
php-fpm8.3 -v
```

### MariaDB
Install MariaDB
```bash
sudo apt install mariadb-server
```

Konfirmasi bahwa MariaDB telah terinstal
```bash
mariadb –version
```

Aktifkan MariaDB pada saat system boot
```bash
sudo systemctl enable mariadb
```

Jalankan MariaDB
```bash
sudo systemctl start mariadb
```

Lihat status MariaDB untuk memverifikasi layanannya berjalan
```bash
sudo systemctl status mariadb
```

Amankan  MariaDB
```bash
sudo mysql_secure_installation
```

Isi prompt dengan jawaban berikut
- Enter current password for root (enter for none):  
Ketik [ENTER]
- Switch to unix_socket authentication [Y/n]  
Jawab: n
- Change the root password? [Y/n]  
Jawab: Y
- Enter a new strong password for the root user.  
Jawab: [masukkan password]
- Re-enter the new root user password and press Enter to save changes.  
Jawab: [masukkan ulang password]
- Remove anonymous users? [Y/n]  
Jawab: Y
- Disallow root login remotely? [Y/n]  
Jawab: Y
- Remove test database and access to it? [Y/n]  
Jawab: Y
- Reload privilege tables now? [Y/n]  
Jawab: Y

### WP-CLI
Install WP-CLI
```bash
Download wp-cli.phar
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
```

Periksa apakah bisa dijalankan
```bash
php wp-cli.phar –info
```

Jadikan executable dan pindahkan ke PATH (bin) agar bisa dijalankan dari mana saja
```bash
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

Test hasilnya
```bash
wp --info
```

### Composer
Download installer composer
```bash
cd ~
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
```

Ambil hash installer untuk verifikasi integritras file
```bash
HASH=`curl -sS https://composer.github.io/installer.sig`
```

Periksa hashnya
```bash
echo $HASH
```

Proses verifikasi
```bash
php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
```

Jika verified maka Install composer
```bash
sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

Konfirmasi bahwa composer sudah terinstal
```bash
composer
```

## Setup Website
### Buat User dan Folder
Buat user untuk website yang ingin kita buat
```bash
sudo useradd uio
```

Masukkan user tersebut ke group www-data
```bash
sudo usermod -a -G uio www-data
```

Buat folder untuk website
```bash
sudo mkdir -p /home/uio
```

Jadikan user yang kita buat sebelumnya sebagai pemilik folder
```bash
sudo chown -R uio:uio /home/uio
```

### Download Source PWK

Clone source code pwk dari github (gunakan user uio)
```bash
cd /home/uio
sudo -u uio git clone...
```

### Setup PHP-FPM pool

Jika masih ada default pool, dihapus/rename saja
```bash
sudo mv /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.bak
```

Buat file PHP-FPM pool
```bash
sudo nano /etc/php/8.3/fpm/pool.d/uio.conf
```

Isi dengan config berikut:
```bash
[uio]
user = uio
group = uio
 
listen = /run/php/php-uio.sock
 
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

Periksa apakah konfigurasi php-fpm yang kita ubah tidak ada masalah
```bash
sudo php-fpm8.3 -t
```

Jika aman, restart
```bash
sudo service php8.3-fpm restart
```

Buat konfigurasi nginx
Buat folder logs (gunakan user uio)
```bash
sudo -u uio mkdir -p /home/uio/uio.my.id/logs
```

### Setup nginx
Buat konfigurasi nginx
```bash
sudo nano /etc/nginx/sites-available/uio.my.id
```

Isi dengan konfigurasi berikut:
```bash
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
 
    server_name uio.my.id *.uio.my.id;
 
    # SSL sertificate (sesuaikan dengan SSL yang digunakan)
    ssl_certificate /etc/letsencrypt/live/uio.my.id/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/uio.my.id/privkey.pem;
 
    access_log /home/uio/uio.my.id/logs/access.log;
    error_log /home/uio/uio.my.id/logs/error.log;
 
    root /home/uio/uio.my.id/web/;
    index index.php;
 
    # Block xmlrpc
    location = /xmlrpc.php {
        deny all;
    }
 
    # Start WP Super Cache rules.
 
    # WebP
    location ~* ^/.+\.(png|gif|jpe?g)$ {
        try_files $uri$webp_suffix $uri =404;
    }
 
    set $cache_uri $request_uri;
 
    # POST requests and urls with a query string should always go to PHP
    if ($request_method = POST) {
        set $cache_uri 'null cache';
    }
 
    if ($query_string != "") {
        set $cache_uri 'null cache';
    }
 
    # Don't cache uris containing the following segments
    if ($request_uri ~* "(/wp-admin/|/xmlrpc.php|/wp-(app|cron|login|register|mail).php|wp-.*.php|/feed/|index.php|wp-comments-popup.php|wp-links-opml.php|wp-locations.php|sitemap(_index)?.xml|[a-z0-9_-]+-sitemap([0-9]+)?.xml)") {
        set $cache_uri 'null cache';
    }
 
    # Don't use the cache for logged in users or recent commenters
    if ($http_cookie ~* "comment_author|wordpress_[a-f0-9]+|wp-postpass|wordpress_logged_in") {
        set $cache_uri 'null cache';
    }
 
    # START MOBILE
    set $is_mobile 'non-mobile';
    if ($http_x_wap_profile) {
        set $is_mobile 'mobile';
    }
 
    if ($http_profile) {
        set $is_mobile 'mobile';
    }
 
    if ($http_user_agent ~* (2.0\ MMP|240x320|400X240|AvantGo|BlackBerry|Blazer|Cellphone|Danger|DoCoMo|Elaine/3.0|EudoraWeb|Googlebot-Mobile|hiptop|IEMobile|KYOCERA/WX310K|LG/U990|MIDP-2.|MMEF20|MOT-V|NetFront|Newt|Nintendo\ Wii|Nitro|Nokia|Opera\ Mini|Palm|PlayStation\ Portable|portalmmm|Proxinet|ProxiNet|SHARP-TQ-GX10|SHG-i900|Small|SonyEricsson|Symbian\ OS|SymbianOS|TS21i-10|UP.Browser|UP.Link|webOS|Windows\ CE|WinWAP|YahooSeeker/M1A1-R2D2|iPhone|iPod|Android|BlackBerry9530|LG-TU915\ Obigo|LGE\ VX|webOS|Nokia5800)) {
        set $is_mobile 'mobile';
    }
 
    if ($http_user_agent ~* (w3c\ |w3c-|acs-|alav|alca|amoi|audi|avan|benq|bird|blac|blaz|brew|cell|cldc|cmd-|dang|doco|eric|hipt|htc_|inno|ipaq|ipod|jigs|kddi|keji|leno|lg-c|lg-d|lg-g|lge-|lg/u|maui|maxo|midp|mits|mmef|mobi|mot-|moto|mwbp|nec-|newt|noki|palm|pana|pant|phil|play|port|prox|qwap|sage|sams|sany|sch-|sec-|send|seri|sgh-|shar|sie-|siem|smal|smar|sony|sph-|symb|t-mo|teli|tim-|tosh|tsm-|upg1|upsi|vk-v|voda|wap-|wapa|wapi|wapp|wapr|webc|winw|winw|xda\ |xda-)) {
        set $is_mobile 'mobile';
    }
    #END MOBILE
 
    set $cache_file 'index';
    if ($scheme = "https") {
        set $cache_file "${cache_file}-https";
    }
 
    if ($is_mobile = "mobile") {
        set $cache_file "${cache_file}-mobile";
    }
 
    set $cache_file "${cache_file}.html";
 
    # Use cached or actual file if they exists, otherwise pass request to WordPress
    location / {
        try_files /app/cache/supercache/$http_host/$cache_uri/$cache_file $uri $uri/ /index.php?$args ;
    }
    # End WP Super Cache rules.
 
    # Prevent PHP scripts from being executed inside the uploads folder.
    location ~* /app/uploads/.*.php$ {
        deny all;
    }
 
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-uio.sock;
        fastcgi_index index.php;
        include fastcgi.conf;
    }
 
    location ~* \.(eot|ttf|woff|woff2)$ {
        add_header Access-Control-Allow-Origin *;
    }
 
    # Subdomain multisite rewrites
    rewrite ^/(wp-.*.php)$ /wp/$1 last;
    rewrite ^/(wp-(content|admin|includes).*) /wp/$1 last;
}
 
server {
    listen 80;
    listen [::]:80;
 
    server_name uio.my.id *.uio.my.id;
 
    return 301 https://uio.my.id$request_uri;
}
```

Buat symlink ke sites-enabled
```bash
sudo ln -s /etc/nginx/sites-available/uio.my.id /etc/nginx/sites-enabled/uio.my.id
```

Periksa apakah konfigurasi nginx yang kita ubah tidak ada masalah
```bash
sudo nginx -t
```

Jika aman, restart
```bash
sudo service nginx restart
```

### Buat Database
Login ke MariaDB database server
```bash
sudo mariadb -u root -p
```
masukkan password yang sudah dibuat sebelumnya

Buat database
```sql
CREATE DATABASE uio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
```

Buat user
```sql
CREATE USER 'uio_user'@'localhost' IDENTIFIED BY 'Pa55w0rdPWKSu54hdit3bax';
```

Grant privilege
```sql
GRANT ALL PRIVILEGES ON uio_db.* TO 'uio_user'@'localhost';
```

Flush/refresh privileges
```sql
FLUSH PRIVILEGES;
```

Keluar dari MariaDB
```sql
exit;
```


