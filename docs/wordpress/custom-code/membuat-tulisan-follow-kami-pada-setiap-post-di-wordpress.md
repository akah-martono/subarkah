---
sidebar_position: 3
---
# Membuat Tulisan Follow Kami pada Setiap Post di WordPress

Berikut membuat membuat tulisan follow/ikuti kami pada setiap post di WordPress tanpa plugin.

## Kode
```php
function ak_follow_us_on_single($content) {
	
	// Only do in single post
	if ( is_single() ) {

		//set your text with link
		$follow_us = sprintf(
			'<p>Suka tulisan ini? Follow <a href="%s">Twitter</a> dan <a href="%s">Facebook</a> kami!',
			'https://twitter.com/AkahMartono',
			'https://www.facebook.com/akah.martono'
		);

		//put your text after post
		$content .= $follow_us;
	}

	return $content;  
}

// Hook the function to WordPress the_content filter
add_filter('the_content', 'ak_follow_us_on_single'); 
```

## Penjelasan

Pada kode di atas kita membuat fungsi ‘ak_follow_us_on_single’ yang digunakan sebagai filter hook ‘the_content’, pada fungsi tersebut kita memeriksa apakah saat ini sedang dalam halaman post menggunakan fungsi is_single(), jika kondisi terpenuhi maka kita menambah tulisan yang ada pada variabel $follow_us pada bagian akhir konten.