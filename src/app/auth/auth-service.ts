import { Injectable, OnDestroy } from '@angular/core';
import { of, from, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core'
import { User } from '../models/user-model';
import { UserInfo } from '../models/user-info.model';
import { PtmService } from '../shared/ptm-service';



export interface AuthResponseData {

  userInfo: {
    role: string;
    status: string;
    lastLoginDate: string;
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string,
    phone: string,
  }
  authtoken: string,
  expiresIn: string
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  constructor(private http: HttpClient,
    private ptmService: PtmService) {

  }
  private _user = new BehaviorSubject<User>(null);
  private _userInfo = new BehaviorSubject<UserInfo>(null);

  private activeLogoutTimer: any;
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }
  get userInfo() {
    return this._userInfo;
  }
  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }


  login(email: string, password: string) {

    const object = {
      userName: email,
      password: password
    }
    return this.ptmService.postData('/api/user/login', null, object)
      .pipe(tap(this.setUserData.bind(this)));
  }

      getUserInfo() {
      return this.userId.pipe(take(1), switchMap(userId => {
       console.log(userId);
        const object = {
        userId: userId,
      }   
      return  this.ptmService.postData('/api/user/getUserInfo', null, object)
      
      }))/* pipe(map(userResp => {
       
        console.log(userResp)
        let userInfo = userResp.user;
        console.log(userInfo)
        const userDetails = new UserInfo(userInfo.role,
          userInfo.firstName,
          userInfo.lastName,
          userInfo.userName,
          userInfo.phone,
        )
       return userDetails;
      }))
    })) */
  }





  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const _userInfo = userData.userInfo;
    /* Stroing user for autologin and local storage*/
    const user = new User(
      _userInfo._id,
      _userInfo.email,
      userData.authtoken,
      expirationTime,
    );

    /*Storing user details*/
    const userDetails = new UserInfo(_userInfo.role,
      _userInfo.firstName,
      _userInfo.lastName,
      _userInfo.userName,
      _userInfo.phone,
    )

    this._userInfo.next(userDetails);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      _userInfo._id,
      userData.authtoken,
      expirationTime.toISOString(),
      _userInfo.email
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    this._userInfo.next(null);

    Plugins.Storage.remove({ key: 'authData' });
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
