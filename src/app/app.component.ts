import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth-service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
      this.platform.ready().then(() => {
        if(Capacitor.isPluginAvailable){
          Plugins.SplashScreen.hide();
        }
    });
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      console.log("App called")

     // this.authService.getUserInfo().pipe(take(1)).subscribe();
      this.previousAuthState = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
