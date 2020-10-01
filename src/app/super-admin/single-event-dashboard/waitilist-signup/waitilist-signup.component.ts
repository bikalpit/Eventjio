import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service'
@Component({
  selector: 'app-waitilist-signup',
  templateUrl: './waitilist-signup.component.html',
  styleUrls: ['./waitilist-signup.component.scss']
})
export class WaitilistSignupComponent implements OnInit {
  activeWaitlist:boolean=false;
  waitListForm:FormGroup;
  checkActiveWaitlist:any="N";
  hideLogo:any ="N";
  showTicket:any = "N";
  boxofficeId:any;
  eventId:any;
  
  waitinglistObject:any;

  constructor(
    private formBuilder: FormBuilder,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
  ) 
  {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    if(localStorage.getItem('selectedEventCode')){
      this.eventId = localStorage.getItem('selectedEventCode')
    }

    this.waitListForm =this.formBuilder.group({
      join_list:['', Validators.required],
      notified_waitlist:['',Validators.required],
      confirmation_msg:['',Validators.required],
    });
   }

  ngOnInit(): void {
  }

  
  fnActiveWaitlist(event){
    this.activeWaitlist=event.checked
    if(event.checked == true){
      this.checkActiveWaitlist = 'Y' 
    }else{
      this.checkActiveWaitlist = 'N' 
    }
  }

  fnShowTicket(event){
    if(event.checked == true){
      this.showTicket = 'Y' 
    }else{
      this.showTicket = 'N' 
    }
  }

   

  fnSavewaitlist(){
    if(this.waitListForm.invalid){
      alert(1);
    }
     alert(2);
     this.waitinglistObject = {
      "active_watlist":this.checkActiveWaitlist,
      "show_ticket":this.showTicket,
      "join_list":this.waitListForm.get('join_list').value,
      "notified_waitlist":this.waitListForm.get('notified_waitlist').value,
      "confirmation_msg":this.waitListForm.get('confirmation_msg').value,
    };

    let requestObject ={
      "boxoffice_id": this.boxofficeId,
      "event_id": this.eventId,
      "option_key":'waiting_list',
      "option_value":this.waitinglistObject,
      "json_type":"Y",
  }

    this.SingleEventServiceService.waitList(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.ErrorService.successMessage(response.response);
      
  } else if(response.data == false){
    this.ErrorService.errorMessage(response.response);
    }
});

  }

}
