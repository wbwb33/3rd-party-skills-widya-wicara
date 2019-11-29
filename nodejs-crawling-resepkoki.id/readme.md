# CRAWLING cookpad.id
- [1. PACKAGES](#PACKAGES)
- [2. SOURCES](#SOURCES)
- [3. FLOW](#FLOW)
- [4. CATATAN](#CATATAN)
- [RESPONSE](#RESPONSE)
- [SOURCES](#SOURCES)

# PACKAGE
* npm i cheerio request url-parse nodemon --save-dev


# FLOW
* percakapan
    ```
    [user]  --> Widya, aku mau masak nih
    [widya] --> Widya punya beberapa rekomendasi masakan nih buat kamu. Kamu ingin masakan dari bahan dasar apa?
                1 Ayam dan Daging
                2 Ikan
                3 Tahu, Tempe, Telur
                4 Sayur
                5 Sambal
                Atau kamu ingin kategori yang lain?

    [user]  --> Widya aku mau tahu resep bikin kue nastar dong
    [widya] --> Berikut ini resep bikin kue nastar,  yang disediakan oleh resepkoki dot aidi
                (membacakan resep)
    ```
* siapkan crawling category
* siapkan crawling category detail list
* siapkan crawling hasil pencarian
* siapkan crawling article terkait

# CATATAN
* menghilangkan tag post instagram
* menunggu tim content membuat user journey
* menunggu daftar kata yang diubah

# RESPONSE
1. [category]()
2. [category-detail-list]()
3. [hasil-pencarian]()
4. [spesifik]()

# SOURCES
1. [1. cheerio](http://zetcode.com/javascript/cheerio/)
2. [2. StackOverFlow - Cheerio nested](https://stackoverflow.com/questions/32655076/cheerio-jquery-selectors-how-to-get-a-list-of-elements-in-nested-divs)