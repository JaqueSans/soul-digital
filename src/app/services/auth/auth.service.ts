import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken: string = '';

  constructor(private auth: Auth) {}

  get logged() {
    return from(authState(this.auth)).pipe(
      tap((user) => {
        if (user) {
          user.getIdToken().then((value) => (this.userToken = value));
        } else {
          this.userToken = '';
        }
      })
    );
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(this.auth.signOut());
  }
}
