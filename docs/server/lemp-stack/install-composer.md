---
sidebar_position: 2
---

# Install Web Server

## Install nginx
Gunakan repo nginx dari Ondřej Surý
```bash
sudo add-apt-repository ppa:ondrej/nginx -y
sudo apt update
```

Install nginx
```bash
sudo apt install nginx -y
```
Konfirmasi bahwa nginx telah terinstal:
```bash
nginx -v
```

## Configure nginx
Docs: https://nginx.org/en/docs/http/ngx_http_core_module.html

Periksa CPU pada server (perhatikan jumlah corenya)
```bash
lscpu
```

Melihat batas jumlah file yang dapat dibuka / open file limit
```bash
ulimit -n
```

Buka nginx.conf
```bash
sudo nano /etc/nginx/nginx.conf
```

### main Context
Sesuaikan worker_processes (maksimal sejumlah CPU core)
```ssh_config
user www-data; 
worker_processes 1;
pid /run/nginx.pid; 
error_log /var/log/nginx/error.log; 
include /etc/nginx/modules-enabled/*.conf;
```

### events Context
Sesuaikan worker_connections (sejumlah open file limit) dan aktifkan multi_accept agar dapat menerima beberapa koneksi sekaligus:
```ssh_config
worker_connections 1024;
multi_accept on;
```

### http Context
#### Basic Settings
Default keepalive_timeout terlalu lama untuk WordPress yaitu 75s, set keepalive_timeout 15s
```ssh_config
keepalive_timeout 15s;
```

Optimizing Performance for Serving Content  
Docs: https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/#optimizing-performance-for-serving-content  
Set sendfile dan tcp_nopush on:
```ssh_config
sendfile on;
tcp_nopush on;
```

Set types_hash_max_size dan client_max_body_size
```ssh_config
types_hash_max_size 2048;    
client_max_body_size 64m;
```

Agar tidak menampilkan informasi tentang nginx di response header, set server_tokens off
```ssh_config
server_tokens off;
```

#### SSL Settings
Biarkan apa adanya
```ssh_config
ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
ssl_prefer_server_ciphers on;
```

#### Logging Settings
Biarkan apa adanya
```ssh_config
access_log /var/log/nginx/access.log;
```

#### Gzip Settings
Docs: https://nginx.org/en/docs/http/ngx_http_gzip_module.html
```ssh_config
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### Virtual Host Configs
Biarkan apa adanya
```ssh_config
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
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

## Hasil Perubahan
Berikut isi nginx.conf setelah perubahan yang kita lakukan
```ssh_conf
user www-data;
worker_processes 1;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 1024;
        multi_accept on;
}

http {    
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

## Install Certbot

Install Certbot beserta plugin untuk nginx
```bash
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

## Install PHP 8.3
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

## Install MariaDB
```bash
sudo apt install mariadb-server
```

Konfirmasi bahwa MariaDB telah terinstal
```bash
mariadb --version
```

Enable the MariaDB system service to start at boot time
```bash
sudo systemctl enable mariadb
```

Start MariaDB on your server
```bash
sudo systemctl start mariadb
```


View the MariaDB service status to verify that it's running on your server
```bash
sudo systemctl status mariadb
```

## Secure the MariaDB Server
```bash
sudo mysql_secure_installation
```
Isi prompt dengan jawaban berikut
- Enter current password for root (enter for none): 
    - [ENTER]
- Switch to unix_socket authentication [Y/n]
    - n
- Change the root password? [Y/n] 
    - Y
- Enter a new strong password for the root user.
    - [masukkan password]
- Re-enter the new root user password and press Enter to save changes.
    - [masukkan ulang password]
- Remove anonymous users? [Y/n]
    - Y
- Disallow root login remotely? [Y/n]
    - Y
- Remove test database and access to it? [Y/n]
    - Y
- Reload privilege tables now? [Y/n]
    - Y

## Access MariaDB
Log in to the MariaDB database server.
```bash
sudo mariadb -u root -p
```
masukkan password yang sudah dibuat sebelumnya

## Download wp-cli.phar
Docs: https://make.wordpress.org/cli/handbook/guides/installing/

Download wp-cli.phar menggunakan curl
```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
```

Periksa apakah bisa jalan
```bash
php wp-cli.phar --info
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