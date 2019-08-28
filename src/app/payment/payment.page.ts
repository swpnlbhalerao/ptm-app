import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { payService } from './payment-service';
import { switchMap, take } from 'rxjs/operators';
import { UserInfo } from '../models/user-info.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  private subscriptions: Subscription = new Subscription();
  error: String = '';
  year = 2019;
  paymentData: any;
  userDetails: UserInfo;
  payData: any
  shownGroup = null;

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private paymentService: payService) {
  }
  ngOnInit() {
    this.fetchPayData().subscribe(payData => {
      this.payData = payData.data;
      console.log(payData.data);
    })
  }
  fetchPayData() {

    return this.authService.getUserInfo().pipe(take(1),
      switchMap(userInfo => {
        this.userDetails = userInfo.user
        return this.paymentService.fetchPaymentData(this.userDetails.userName, this.year);
      }));
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };


  processPay(status: string, id: number) {
    console.log(status, id);

    this.alertCtrl.create({
      message: `Are you sure you want to ${status}  ?`,
      header: 'Confirmation',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          role: 'submit',
          handler: data => {
            console.log('Submit  clicked', data);
            this.processPayment(id, status, data);
          }
        },
      ], inputs: [
        {
          placeholder: `please enter ${status} reason`,
          name: 'reason',
        }
      ]

    }).then(alertEl => {
      alertEl.present();
    })

  }

  processPayment(id: number, status: string, reason: string) {

    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'processing payment'
    }).then(loadingEl => {
      loadingEl.present();

      setTimeout(() => {
        console.log(id, status, reason);
        loadingEl.dismiss();
      }, 2000);


    })
  }


}
