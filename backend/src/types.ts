export interface Offers {
  zipCode: number;
  houses: number;
}

export interface House {
  externalId: string;
  price: number;
  surface: number;
  rooms: number;
  zipCode: string;
}

export interface Context {}
