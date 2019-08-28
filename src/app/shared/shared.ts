
import { Injectable} from '@angular/core'
import {  LoadingController } from '@ionic/angular'

@Injectable({providedIn:"root"})
export class SharedService {

    constructor(private loaderCtrl:LoadingController){

    }


    showAlert(message:string,){
        return this.loaderCtrl.create({
            message:message,
  })
    }

}