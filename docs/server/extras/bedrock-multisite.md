---
sidebar_position: 1
---

# Bedrock Multisite


## Install Composer
### Fetch the Composer Installer
Begin by navigating to your home directory. Following that, employ the curl command to download the installer. The -sS flags make curl silent while still showing errors, and -o directs the output to a specific location.
```bash
cd ~
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
```

### Verify the Installer’s Integrity
Composer provides the latest installer’s SHA-384 hash on its Public Keys/Signatures page. We need to compare the hash of the downloaded file with this to ensure its integrity.

You can fetch the latest hash programmatically from the Composer page and store it in a shell variable:
```bash
HASH=`curl -sS https://composer.github.io/installer.sig`
```

To inspect the fetched hash, execute the following:
```bash
echo $HASH
```

Proceed to verify the integrity of the installation script by matching the hash of the downloaded file with the obtained hash. The following PHP command checks if they match:
```bash
php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
```

### Install Composer

With the verified installer, you’re now ready to install Composer. We’ll be doing a global installation, which means Composer will be accessible system-wide as a command named ‘composer’, residing under /usr/local/bin. Use the following command:
```bash
sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

### Validate Composer Installation
To confirm that Composer has been installed correctly and is functioning as expected, run:
```bash
composer
```

## Create User and Folder
Buat user untuk website yang ingin kita buat
```bash
sudo useradd uio
```

Masukkan user tersebut ke group www-data
```bash
sudo usermod -a -G uio www-data
```

Buat folder untuk website yang ingin kita buat
```bash
sudo mkdir -p /home/uio
```

Jadikan user yang kita buat sebelumnya sebagai pemilik folder
```bash
sudo chown -R uio:uio /home/uio
```

## Ganti user 
Ganti user dengan pemilik website
```bash
sudo su uio
```

Pindah ke folder website yang telah dibuat sebelumnya
```bash
cd /home/uio
```

## Install Bedrock
Install Bedrock Menggunakan Composer
```bash
composer create-project roots/bedrock uio.my.id
```

Install mu-plugin for multisite
```bash
cd uio.my.id
composer require roots/multisite-url-fixer
```


## Create PHP-FPM Pool Config
Jika masih ada default pool, dihapus/rename saja
```bash
sudo mv /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.bak
```

Buat file PHP-FPM pool
```bash
sudo nano /etc/php/8.3/fpm/pool.d/uio.conf
```

Isi dengan config berikut:
```ssh_conf
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
sudo certbot certonly --manual --preferred-challenges=dns --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d uio.my.id -d *.uio.my.id
```

## Add nginx Config for New Site
Buat folder logs
```bash
sudo -u uio mkdir -p /home/uio/uio.my.id/logs
```

Buat konfigurasi nginx untuk website yang ingin dibuat:
```bash
sudo nano /etc/nginx/sites-available/uio.my.id
```

Isi dengan konfigurasi berikut:
```ssh_config
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
 
    server_name uio.my.id *.uio.my.id;
 
    ssl_certificate /etc/letsencrypt/live/uio.my.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/uio.my.id/privkey.pem;
 
    access_log /home/uio/uio.my.id/logs/access.log;
    error_log /home/uio/uio.my.id/logs/error.log;
 
    root /home/uio/uio.my.id/web/;
    index index.php;
 
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
 
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
 
    location = /xmlrpc.php {
        deny all;
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

## Restart nginx
Periksa apakah konfigurasi yang kita ubah aman
```bash
sudo nginx -t
```
Jika aman, restart
```bash
sudo service nginx restart
```

## Create Database
Log in to the MariaDB database server.
```bash
sudo mariadb -u root -p
```
masukkan password yang sudah dibuat sebelumnya


Create database
```sql
CREATE DATABASE uio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
```

Create user
```sql
CREATE USER 'uio_user'@'localhost' IDENTIFIED BY 'Workshop@WPBogor2025';
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

https://roots.io/bedrock/docs/installation/



## Buat cron job
Buka settingan cron
```bash
sudo -u uio crontab -e
```

isi dengan perintah berikut
```
*/5 * * * * cd /home/uio/uio.my.id/; /usr/local/bin/wp cron event run --due-now >/dev/null 2>&1
```