---
sidebar_position: 1
---

# Setup and Secure VPS

## Setup Timezone
Menyesuaikan waktu server dengan timezone kita:
```bash
sudo dpkg-reconfigure tzdata
```

## Update Software Package
Memperbarui daftar paket software pada linux
```bash
sudo apt update -y
```
Download dan install paket terbaru
```bash
sudo apt dist-upgrade -y
```
Menghapus paket-paket software yang sudah tidak terpakai
```bash
sudo apt autoremove
```

## Reboot Server
```bash
sudo reboot now
```

## Install ufw
Menginstall Uncomplicated Firewall
```bash
sudo apt install ufw
```

## Allow the ports for SSH (22), HTTP (80), and HTTPS (443)
Mengijinkan port 22 (SSH), 80 (HTTP), dan 443 (HTTPS)
```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

## Review rules
Review rules yang telah dibuat
```bash
sudo ufw show added
```

## Enable rules
Mengaktifkan rules yang telah dibuat
```bash
sudo ufw enable
```

## Confirm that the new rules are active
Memastikan rules aktif
```bash
sudo ufw status verbose
```

## Install Fail2ban
```bash
sudo apt install fail2ban
```

## Start fail2ban
```bash
sudo service fail2ban start
```