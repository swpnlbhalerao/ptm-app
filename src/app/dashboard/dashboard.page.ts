import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { UserInfo } from '../models/user-info.model';
import { DashboardService } from './dashboard-service';
import { take, switchMap } from 'rxjs/operators';
import { SegmentChangeEventDetail } from '@ionic/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  private subscriptions: Subscription = new Subscription();
  highcharts = Highcharts;
  chartOptions:any;
  userDetails: UserInfo;
  pieChart = Highcharts;
 // pieChartOptions;
  error: String = '';
  year = 2019;
  eventType="bar";
  dashBoardObs:Observable<any>;

//loader
private loadingSubject = new BehaviorSubject<boolean>(false);
public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private dashboardService: DashboardService) { }

  ngOnInit() {
      this.fetchDashBoard();
}

    fetchDashBoard(){
    this.dashBoardObs=null;
    this.chartOptions=null;
   
     if(this.eventType === 'bar'){
     console.log("called bar chart");
      this.dashBoardObs = this.getBarChart();
     } else{
      console.log("called pie chart");
       this.dashBoardObs = this.getPieChart();
     } 
   
   this.subscriptions.add(this.dashBoardObs.subscribe(response => {
    this.chartOptions = response;
     this.loadingSubject.next(true);
   console.log("chart options for  "+this.eventType,this.chartOptions);
   },
     error => {
       console.log("Dashboard Error", error);
       this.error = error
       this.loadingSubject.next(true);
     }
   ));
  }

  
  onFilterUpdate(event :any){
    console.log(event.detail);
    if(this.eventType !== event.detail.value){
    this.eventType=event.detail.value;
    this.loadingSubject.next(false);
     this.fetchDashBoard();
  }  
  }



  getBarChart() {
    
    return this.authService.getUserInfo().pipe(take(1),
      switchMap(userInfo => {
        this.userDetails=userInfo.user
      return this.dashboardService.getBarChart(this.userDetails.userName, this.year)
      })
    );
  }

  getPieChart() {
    
    return this.authService.getUserInfo().pipe(take(1),
      switchMap(userInfo => {
        this.userDetails=userInfo.user
      return this.dashboardService.getPieChart(this.userDetails.userName, this.year)
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
