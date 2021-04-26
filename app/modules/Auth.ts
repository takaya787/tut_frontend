export class Auth {
  //localstorageがrailsのsessionに等しい
  static login(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  //tokenがsetされていたらtrueを返す
  static isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
  }
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  static getToken(): string | void {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
  }
}
