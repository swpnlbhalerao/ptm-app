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

  diseases = [
    { title: "Type 1 Diabetes", description: "Type 1 diabetes is an autoimmune disease in which the body’s immune system attacks and destroys the beta cells in the pancreas that make insulin." },
    { title: "Multiple Sclerosis", description: "Multiple sclerosis (MS) is an autoimmune disease in which the body's immune system mistakenly attacks myelin, the fatty substance that surrounds and protects the nerve fibers in the central nervous system." },
    { title: "Crohn's & Colitis", description: "Crohn's disease and ulcerative colitis (UC), both also known as inflammatory bowel diseases (IBD), are autoimmune diseases in which the body's immune system attacks the intestines." },
    { title: "Lupus", description: "Systemic lupus erythematosus (lupus) is a chronic, systemic autoimmune disease which can damage any part of the body, including the heart, joints, skin, lungs, blood vessels, liver, kidneys and nervous system." },
    { title: "Rheumatoid Arthritis", description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." }
  ];

  shownGroup = null;

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private paymentService: payService) {
  }
  ngOnInit() {
    this.fetchPayData().subscribe(payData => {
      this.payData = payData;
      console.log(payData);
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
