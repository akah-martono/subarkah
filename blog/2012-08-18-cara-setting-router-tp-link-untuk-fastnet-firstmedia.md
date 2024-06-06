---
slug: cara-setting-router-tp-link-untuk-fastnet-firstmedia
title: Cara Setting Router TP-Link untuk FastNet (FirstMedia)
authors:
  - name: Akah Martono
    title: Ayah 2 anak
    url: https://github.com/akah-martono
    image_url: https://avatars.githubusercontent.com/u/143365979?v=4
tags: [wordpress]
---

Pas mudik tahun ini ternyata di rumah udah pasang internet dari firstmedia, jadi senang karena bisa ol di rumah tanpa mengurangi quota telkomsel flash. Tapi sayang harus nyolok kabel, padahal yg pakai lebih dari 1 orang dan mau pakai untuk android juga. singkat cerita sore ini langsung ke TangCity buat cari acces point (halah jadi kepanjangan).

Ok langsung aja ya, wireless router yg saya beli adalah TL-WR941N / TL-WR941ND (karena gak ada pilihan dan toko2 banyak yang tutup) dan kemungkinan ini berlaku untuk semua router produk tp-link. berikut langkah-langkah setting router TP-Link untuk FastNet:

1. Pastikan laptop/pc yang ingin digunakan untuk mengkonfigur router sudah dikenal oleh modem bawaan fastnet (colok dulu kabel utp 2. dari modem fastnet ke laptop/pc dan pastikan internetnya nyambung)
3. Cabut kabel utp dari modem fastnet di laptop/pc lalu colok ke Port WAN di router TP-Link
Colok kabel utp bawaan tp-link ke salah satu port lan (di model TL-WR941N / TL-WR941ND ada 4 port LAN) dan ke Laptop/PC tadi.
4. Buka browser dan ketik http://192.168.1.1 masukan user: admin, pass: admin (ini pass standar tp-link)
5. Pilih Quick Setup lalu klik next
Pilih Dynamic IP, lalu klik Next
Konfigur Wireless, isi SSID dengan nama yang anda kehendaki (dalam contoh ini nama adik saya), pilih WPA-PSK/WPA2-PSK pada wireless security dan masukan PSK Passwordnya.
Quick Setup selesai!, klik Finish
6. Clone Mac Address laptop/PC ke router (inilah sebabnya kenapa laptop/pc harus dikenal oleh modem fastnet pada langkah pertama di atas), caranya pilih menu Network -> MAC Clone lalu klik “Clone MAC Address”, lalu Save.
7. Konfigur DHCP, masuk ke Menu DHCP lalu isi DNS dengan DNS Google, untuk isian yang lain boleh dibiarkan default saja. lalu Save.
8. Setelah anda save TP-Link akan minta reboot silahkan klik tulisan “click here”
9. Lalu Klik Reboot
10. Setting router TP-Link untuk FastNet selesai deh

Semoga bermanfaat.