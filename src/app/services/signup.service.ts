import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/User.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  displayName: string
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) { }

  signup({name, email, password}) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA760rVlSovzYOMCd3Zk37lFYxs0z9GqVc', {
      displayName: name,
      email,
      password,
      returnSecureToken: true
    })
    .pipe(tap(res=> {
      const user = new User(res.displayName, res.email, res.localId, res.idToken, new Date(Date.now() + +res.expiresIn*1000));
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }));
  }

  signin({email, password}) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA760rVlSovzYOMCd3Zk37lFYxs0z9GqVc', {
      email,
      password,
      returnSecureToken: true
    })
    .pipe(tap(res=> {
      const user = new User(res.displayName, res.email, res.localId, res.idToken, new Date(Date.now() + +res.expiresIn*1000));
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }))
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/signin']);
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user) return;
    const loadedUser = new User(user.name, user.email, user.id, user._token, new Date(user._tokenExp))
    if(loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
}
