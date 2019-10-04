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
  shownGroup = null;

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
 
     this.dashBoardObs = this.getApprovals();
    
 
 this.subscriptions.add(this.dashBoardObs.subscribe(response => {
  this.approvalData = response.data;
  console.log(this.approvalData);
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


getApprovals() {
 return this.authService.getUserInfo().pipe(take(1),
  switchMap(userInfo => {
    this.userDetails = userInfo.user
    return  this.approvalService.getApprovals(this.eventType);
  }));
}

ngOnDestroy() {
  this.subscriptions.unsubscribe();
}

process(status: string, id: string) {
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
        handler: remarks => {
          console.log('Submit  clicked', remarks.reason);
          this.processPayment(id, status, remarks.reason);
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

processPayment(id: string, status: string, remarks: string) {

  this.sharedService.showAlert('please wait ..').then(loadingEl => {
    loadingEl.present();
   

    this.approvalService.proccessRequest(this.eventType,id, status, remarks,this.userDetails.userName).subscribe(
      response => {
        this.showAlert('success',response.message);
        console.log(this.approvalData);
        loadingEl.dismiss();
       }, error => {
           console.log("Approval Error", error);
           this.error = error
           this.showAlert('failed',error);
           loadingEl.dismiss();
         }
         
    );
   
   
   
   
    setTimeout(() => {
      console.log(id, status, remarks,this.userDetails.userName)
      
      
      
      
    }, 2000);

  })
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

  private showAlert(status:string,message:string){
    this.alertCtrl.create({
      message: message,
      header:status,
      buttons: [
        {
          text: 'Close',
          role: 'Okay',
        }],
    }).then(alertEl => {
      alertEl.present();
    })
  }

}
