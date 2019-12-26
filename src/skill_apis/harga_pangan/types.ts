export interface IHargaPanganPerProvinsi {
  id: number;
  lastUpdate: string;
  beras: string;
  ayam: string;
  sapi: string;
  telur: string;
  bawMerah: string;
  bawPutih: string;
  cabMerah: string;
  cabRawit: string;
  minyak: string;
  gula: string;
}

export class IHargaPanganPerProvinsi {
  constructor(){
    this.id = 0;
    this.lastUpdate = '';
    this.beras = '';
    this.ayam = '';
    this.sapi = '';
    this.telur = '';
    this.bawMerah = '';
    this.bawPutih = '';
    this.cabMerah = '';
    this.cabRawit = '';
    this.minyak = '';
    this.gula = '';
  }
}