/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';

export interface Cookie {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  getCookies(): Cookie[] {
    const cookies: Cookie[] = document.cookie
      .split(';')
      .map((cookie: string) => {
        const values = cookie.trim().split('=');
        return {
          name: values[0],
          value: values[1]
        };
      });
    return cookies;
  }

  getCookie(name: string): Cookie | undefined {
    const cookies: Cookie[] = this.getCookies();
    return cookies.find((cookie) => cookie.name === name);
  }

  setCookie(name: string, value: string, expirationDate?: Date): void {
    let date = expirationDate;
    if (!expirationDate) {
      date = new Date();
      date.setTime(date.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
    }
    // Set "path" to root, since the default path might conflict in different scs
    // by having multiple cookies with diffrent paths
    document.cookie = `${name}=${value}; path=/; expires=${date!.toUTCString()}`;
  }
}
