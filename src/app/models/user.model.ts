export interface User {
  email: string;
  fname: string;
  lname: string;
  pwd: string;
  processing: {title: string, expire: number} [];
  pickup: {title: string, expire: number} [];
  checkout: {title: string, expire: number} [];
}
