const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

/**
 * 
 * @param {*} endpoint  --> url yang akan dicari berdasarkan input user
 * @param {*} callback  --> callback berupa url, list url dan list category
 */
function search(query, endpoint, callback){
    console.log("resep yang dicari :", query);
    let tmp_query = "";
    var words = query.split(' ');
    // in case 2 word in slice diballik dari rendang jengkol jadi jengkol rendang
    if(words.length == 2){
        tmp_query = words[1] + " " + words[0];
    }
    let title = "search";
    let list_pilihan = [];
    let flag = false;
    var list_url = [];
    request(endpoint,(error, response, body)=>{
        const $ = cheerio.load(body);
        $('.masonry-grid').find('> div > article > div > div > header > h3 > a').each(function (index, element) {
            let url = $(element).attr('href');
            list_url.push(url);
        });
        
        // mendapatkan text endpoint category : replace  https://resepkoki.id/resep/resep-udang-pete-balado/ --> resep udang pete balado
        for(val in list_url){
            let category = list_url[val].replace(/https:\/\/resepkoki.id\/resep\//g,'');
            category = category.replace(/\/|-/g,' ');
            category = category.replace(/https:/g,'');
            category = category.replace(/resepkoki.id/g,'');
            category = category.replace(/resep/g,'');
            list_pilihan.push(category.trim());

            // cukup 5 pilihan untuk user
            if(val == 4){
                break;
            }
        };

        for(i in list_pilihan){
            // terdapat resep pada list pencarian 
            if(query === list_pilihan[i] | tmp_query === list_pilihan[i]){
                detail_resep(list_url[i], callback); // cari detail resep
                break;
            }
            else if(i === (list_pilihan.length-1).toString())
            {
                callback(title, list_url, list_pilihan);
            }
        }
    });
}



/**
 * spesifik menuju endpoint : https://resepkoki.id/resep/${query}
 * @param {*} endpoint --> endpoint of crawling
 * @param {*} callback --> callback return
 */
function detail_resep(endpoint, callback){
    let title = "detail-resep";

    request(endpoint, (error, response, body) => {
        const $ = cheerio.load(body);

        let list_bahan = [];
        $('.ingredients-table').find('> tbody > tr > td ').each(function (index, element) {
            let bahan = $(element).text();
            // preprocessing untuk tts
            bahan = bahan.replace(/\n/g, "");
            bahan = bahan.replace(/\-/g,"sebanyak");
            bahan = bahan.replace(/sdm/g,"sendok makan");
            bahan = bahan.replace(/sdt/g,"sendok teh");
            bahan = bahan.replace(/ml/g,"mili liter");
            bahan = bahan.replace(/1\/2/g,"setengah");
            bahan = bahan.replace(/1\/3/g,"se per tiga");
            bahan = bahan.replace(/2\/3/g,"dua per tiga");
            bahan = bahan.replace(/1\/4/g,"se per empat");

            list_bahan.push(bahan);
        });

        // remove item kosong dari array 
        for(var i = list_bahan.length-1; i--;){
            if(list_bahan[i] === '' || list_bahan[i] === ' ') list_bahan.splice(i,1);
        }

        let list_langkah = [];
        $('.recipe-steps-table').find('> tbody > tr > td').each(function (index, element) {
            let single_step_title = $(element).find('> h4').text();
            let single_step_description = $(element).find('> .single-step-description-i').text();

            // ganti enter \n new line dengan kosong
            single_step_description = single_step_description.replace(/\n/g, "");

            // keluar saat tips terdeteksi
            if(single_step_title.toLowerCase() === 'tips'){
                return false;
            }

            list_langkah.push(single_step_title);
            list_langkah.push(single_step_description);
        });

        // delete array kosong
        for(var i = list_langkah.length-1; i--;){
            if(list_langkah[i] === '' || list_langkah[i] === ' ') list_langkah.splice(i,1);
        }

        callback(title,list_bahan, list_langkah);
    });
}




/**
 * log_data merepresentasikan data yang akan di response ke chatbot
 */
function log_data(title,list, detail){
    var title_category =['search','detail-resep'];
    if(title === title_category[1])
    {
        // set bahan as paragraf
        let bahan = "";
        for(i in list){
            bahan = bahan + list[i] + ".";
        }

        // set langkah as paragraf
        let langkah = "";
        for(i in detail){
            langkah = langkah + detail[i] + ".";
        }

        var obj = {};
        var str_bahan = "bahan";
        var str_langkah = "langkah";
        obj[str_bahan] = bahan;
        obj[str_langkah] = [langkah];
        console.log(JSON.stringify(obj));

    }else{
        var obj = {};
        var pilihan = "pilihan";
        obj[pilihan] = detail;
        console.log(JSON.stringify(obj));
    }
};

module.exports = {
    search,
    detail_resep,
    log_data
}