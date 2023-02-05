import {
  FatsecretContainer,
  FatsecretData,
} from 'src/common/models/fatfacts.model';
import { HttpClient } from '@angular/common/http';

export class LocalBankAsset {
  readData(client: HttpClient): Promise<FatsecretContainer> {
    return new Promise((resolve, reject) => {
      //read from assets using HTTPclient
      let data: FatsecretContainer = [];
      try {
        client.get('assets/nutrientBank.json').subscribe((result) => {
          console.log(result);
          data = result as FatsecretContainer;
          resolve(data);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
