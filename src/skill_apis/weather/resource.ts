import fs from 'fs';
import { bmkg_xml } from "./bmkg_data";
import { parseString } from "xml2js";
import request from 'request'

class BMKG {

    public get = async () => {
        bmkg_xml.forEach(e => this.gettingData(e));
    }

    private gettingData = async (xml: bmkg_xml) => {
        request(xml.link, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(response.body, function (err: Error, result) {
                    const json = JSON.stringify(result);
                    if (err) {
                        console.log(err)
                    } else {
                        fs.writeFile('cache/' + xml.prov + '.json', json, 'utf-8', (e => {
                            console.log(`done get ${xml.prov} weather`);
                        }));
                    }
                });
            }
        });
    };
}

const bmkg = new BMKG()
export default bmkg;