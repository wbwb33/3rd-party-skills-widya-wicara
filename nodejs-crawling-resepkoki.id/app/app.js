var crawl = require('./crawl');



/**
 * [user]  --> Widya, aku mau masak nih
 * [widya] --> return list of categories.
 * list of categories :
 * 1. ayam daging 
 * 2. ikan seafood 
 * 3. jajanan pasar 
 * 4. keripik kerupuk 
 * 5. kue roti 
 * 6. nasi mie pasta 
 * 7. puding jeli 
 * 8. sambal 
 * 9. sayur
 * 10. sop soto bakso 
 * 11. tahu tempe telur 
 */
// var url_category = `https://resepkoki.id`;
// crawl.category(url_category, crawl.log_data);





/**
 * cek apakah query berada pada list of category ataukah tidak
 * [user]  --> Widya, aku mau masak sambal
 * [widya] --> response json category sambal
 * 
 * @var query --> masukan dr user, bisa detail url, bisa hanya kata saja
 * kalo url berrti sudah bersarang, kalo kata saja bertti baru intro
 */
var query = "resep kue talam labu kuning";
query = query.replace(/resep/g, "");
query = query.trim();

let tmp_query = query.replace(/^\s+|\s+|\s+$|\s+(?=\s)/g, "-");
var url_search = `https://resepkoki.id/?s=${tmp_query}`; 

var categories = [
    'ayam','daging','ikan','seafood','jajanan','pasar','keripik','kerupuk','kue','roti','nasi','mie','pasta','puding','jeli','sambal','sayur','sop','soto','bakso','tahu','tempe','telur'
]

crawl.search(query, url_search, crawl.log_data);
