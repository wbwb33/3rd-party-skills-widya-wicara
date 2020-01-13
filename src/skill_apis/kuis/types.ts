export interface IKuisOnly {
  pertanyaan: string,
  benar: string,
  benar2: string,
  choice: string
}

export interface IKuis {
  id: number,
  q: string,
  benar: string,
  benar2: string,
  choice: string
}

export class IKuis {
  constructor() {
    this.id = 0;
    this.q = '';
    this.benar = '';
    this.benar2 = '';
    this.choice = '';
  }
}