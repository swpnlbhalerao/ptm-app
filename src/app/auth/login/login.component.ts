import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLogin = true;
  isLoading = false;

  constructor(private authService: AuthService, 
    private router: Router,
    private alertCntrl: AlertController,
    private loadingCntrl:LoadingController
     ) { }

  ngOnInit() {}

  authenticate(form: NgForm) {
    const formValue = form.value;
    this.isLoading = true;
    this.loadingCntrl.create({ keyboardClose: true, message: 'Logging in...' })
     .then(loadingEl=>{
      loadingEl.present();
      this.authService.login(formValue.email, formValue.password).subscribe(
         response => {
            if (response.status === 'success') {
              loadingEl.dismiss();
              this.router.navigateByUrl('dashboard');
            } else {
              loadingEl.dismiss();
              console.log('failed');
              this.showPop('Error Login', 'Invalid email or password', [{
                role: 'invalid',
                text : 'okay'
              }] );
            }
         
        },error=>{
         // console.log(error);
          loadingEl.dismiss();
          this.showPop('Error Login', error, [{
            role: 'invalid',
            text : 'okay'
          }] );
        })
    })

  }


  

  showPop(header: string, message: string, buttons: any) {
    this.alertCntrl.create({
      // tslint:disable-next-line: object-literal-shorthand
      header: header,
      // tslint:disable-next-line: object-literal-shorthand
      message: message,
      // tslint:disable-next-line: object-literal-shorthand
      buttons: buttons,
    }).then(alertEl => {
       alertEl.present();
    });
  }


}
