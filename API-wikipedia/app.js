/*
1. get title
2. search page based on title
*/

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 * @param title: the highest result of title search
 * @param extract: main of page from wikipedia
 */


const rest = require('./crawl-wikipedia');



const options = {
    host: 'id.wikipedia.org',
    port: 443,
    path:"",
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
};
 

// input user
let query="sby";
query = query.replace(/^\s+|\s+|\s+$|\s+(?=\s)/g, "%20"); // ganti spasi, tabs dengan %20

// 1. get the title of list --> 1st
const path_query =`/w/api.php?action=query&list=search&utf8=&format=json&srsearch=${query}`;
options.path = path_query;
rest.getJSON(options, (result) => {
    let data   = JSON.parse(JSON.stringify(result)).query; // --> data output berada pada object query yang merupakan sub-object array 
    let pages = JSON.parse(JSON.stringify(data)).search;
    let title = JSON.parse(JSON.stringify(pages[0])).title; // get first title
    console.log(title);

    // ganti spasi, tabs dengan %20
    title = title.replace(/^\s+|\s+|\s+$|\s+(?=\s)/g, "%20");
    console.log(title);

    // 2. search page based on title
    const path_title =`/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}`;
    options.path = path_title;
    rest.getJSON(options, (cb) => {
      let query   = JSON.parse(JSON.stringify(cb)).query;
      let pages   = JSON.parse(JSON.stringify(query)).pages;
      let keysArray = Object.keys(pages);
      let key = keysArray[0];
      let tmp_pages = pages[key];
      let extract   = JSON.parse(JSON.stringify(tmp_pages)).extract; // this the output of pages
      extract = extract.replace(/\((.*?)\)|\[(.*?)\]/g, ""); // ganti value di dalam () atau di dalam [], tabs dengan spasi
      console.log(extract);
    });
});


