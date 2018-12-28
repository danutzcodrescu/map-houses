import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key));
  }
}
