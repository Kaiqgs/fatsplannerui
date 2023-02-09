import {
  ComplexContainer,
  LabeledNutrient,
} from 'src/common/models/fatfacts.model';
import { HttpClient } from '@angular/common/http';

export class LocalBankAsset {
  readData(client: HttpClient): Promise<ComplexContainer> {
    return new Promise((resolve, reject) => {
      //read from assets using HTTPclient
      let data: ComplexContainer = [];
      try {
        client.get('assets/nutrientBank.json').subscribe((result) => {
          console.log(result);
          data = result as ComplexContainer;
          resolve(data);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
