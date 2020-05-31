import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/User.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

/* interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  displayName: string
} */

interface AuthResponseData {
  success: true,
  message: {
    name: string,
    user_id: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) { }

  signup({name, email, password}) {
    return this.http.post<AuthResponseData>('https://stackhack-todo.herokuapp.com/api/signup', {
      name,
      email,
      password,
    }, {observe: 'response'})
    .pipe(tap(res=> {
      console.log(res.body.message);
      const token = res.headers.get('X-Auth-Token');
      const user = new User(res.body.message.name, 'test@test.com', res.body.message.user_id, token, new Date(Date.now() + 30*24*60*1000));
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }));
  }

  signin({email, password}) {
    return this.http.post<AuthResponseData>('https://stackhack-todo.herokuapp.com/api/login', {
      email,
      password,
    }, {observe: 'response'})
    .pipe(tap(res=> {
      const token = res.headers.get('X-Auth-Token');
      console.log(res.body.message)
      const user = new User(res.body.message.name, 'test@test.com', res.body.message.user_id, token, new Date(Date.now() + 30*24*60*1000));
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
