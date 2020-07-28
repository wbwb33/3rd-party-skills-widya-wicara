import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import * as dotenv from 'dotenv';
import https from 'https';
dotenv.config();

class AlarmSkill {
  public index = async (req: Request, res: Response) => {
    const username = req.body.username;
    const dsn = req.body.dsn;
    const scheduleTime = req.body.scheduleTime;
    const alertToken = req.body.alertToken;

    console.log(username+dsn+scheduleTime+alertToken);
    const response = await this.postToPlatform(username,dsn,scheduleTime,alertToken);

    res.send(JSON.parse(`{"status": "success", "message": "Set Alarm", "response": "${response}"}`));

  }

  private postToPlatform = async (username: string, dsn: string, scheduleTime: string, alertToken: string) => {
    return new Promise( async (resolve, reject) => {

      const agent = new https.Agent({
        ecdhCurve: 'auto',
        ciphers: 'ALL',
        secureProtocol: 'TLS_method',
        rejectUnauthorized: false,
      });
      
      const { PLATFORM_URL } = process.env;

      var options = {
        method: 'POST',
        uri: `${PLATFORM_URL}/api/device/v1/alarm`,
        form: {
          header: { namespace: 'Alerts', name: 'SetAlert' },
          payload: {
            username,
            deviceUUID: dsn,
            scheduleTime,
            alertToken,
            assets: [
              {
                assetId: 'alarm1',
                assetUrl: 'File://usr/misc/resources/alarm/WidyawicaraAlarm03.mp3',
              },
            ],
          }
        },
        agent
      };

      console.log(options);

      await rp(options)
        .then((body) => {
          console.log(`ALARM SET: ${JSON.stringify(body)}`);
          resolve(JSON.stringify(body));
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    })
  }
}

export const alarmSkill = new AlarmSkill();
