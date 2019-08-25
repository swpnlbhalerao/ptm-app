import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServices } from '../authservices';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private authServices: AuthServices, private router: Router, private alertCntrl: AlertController) { }

  ngOnInit() {}

  submitForm(form: NgForm) {
    const formValue = form.value;
    console.log(formValue);
    this.authServices.login(formValue.email, formValue.password).subscribe(
      response => {
        if (response === 'success') {
          this.router.navigateByUrl('dashboard');
        } else {
          console.log('failed');
          this.showPop('Error Login', 'Invalid email or password', [{
            role: 'invalid',
            text : 'okay'
          }] );
        }
      }
    );

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
