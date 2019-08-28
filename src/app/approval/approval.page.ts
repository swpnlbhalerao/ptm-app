import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth-service';
import { UserInfo } from '../models/user-info.model';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from '../shared/shared';
import { switchMap, take } from 'rxjs/operators';
import { ApprovalService } from './approval-service';


@Component({
  selector: 'app-approval',
  templateUrl: './approval.page.html',
  styleUrls: ['./approval.page.scss'],
})
export class ApprovalPage implements OnInit {
  private subscriptions: Subscription = new Subscription();
  userDetails: UserInfo;
  error: String = '';
  year = 2019;
  eventType="apr";
  dashBoardObs:Observable<any>;
  approvalData:any

  constructor(private alertCtrl: AlertController,
    private authService: AuthService,
    private sharedService :SharedService,
    private approvalService :ApprovalService
   ) {
  }

  ngOnInit() {
    this.fetchApprovals();
}

fetchApprovals(){

  this.sharedService.showAlert('please wait ..').then(loaderEl=>{
    loaderEl.present();
    this.dashBoardObs=null;
  this.approvalData=null;
 
   if(this.eventType === 'apr'){
   console.log("called apr");
    this.dashBoardObs = this.getPayApprovals();
   } else{
    console.log("called reg");
     this.dashBoardObs = this.getRegApprovals();
   } 
 
 this.subscriptions.add(this.dashBoardObs.subscribe(response => {
  this.approvalData = response;
   loaderEl.dismiss()
 },
   error => {
     console.log("Approval Error", error);
     this.error = error
     loaderEl.dismiss();
   }
 ));
  });
  
  
}


onFilterUpdate(event :any){
  console.log(event.detail);
  if(this.eventType !== event.detail.value){
  this.eventType=event.detail.value;
   this.fetchApprovals();
}  
}


getPayApprovals() {
  
  return this.authService.getUserInfo().pipe(take(1),
    switchMap(userInfo => {
      this.userDetails=userInfo.user
    return this.approvalService.getPayApprovals();
    })
  );
}

getRegApprovals() {
  
  return this.authService.getUserInfo().pipe(take(1),
    switchMap(userInfo => {
      this.userDetails=userInfo.user
      return this.approvalService.getRegApprovals;
        })
  );
}
ngOnDestroy() {
  this.subscriptions.unsubscribe();
}

process(status: string, id: number) {
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

  this.sharedService.showAlert('please wait ..').then(loadingEl => {
    loadingEl.present();
    setTimeout(() => {
      console.log(id, status, reason);
      loadingEl.dismiss();
    }, 2000);

  })
}
}
