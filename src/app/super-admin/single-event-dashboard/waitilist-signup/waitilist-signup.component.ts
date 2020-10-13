import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service'
import { ExportToCsv } from 'export-to-csv';
import { Stats } from 'fs';

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
  isLoaderAdmin:any;  
  waitinglistObject:any;
  getAllWaitingListData:any;
  getNewWaitingListData:any;
  getNotifyWaitingListData:any;
  clickedIndex: any = 'ALL'
  search = {
    keyword: ""
  };
  
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

    // if(localStorage.getItem('currentUser')){
    //   this.tokenId = localStorage.getItem('token')
    // }
    // alert(this.tokenId)

    this.waitListForm =this.formBuilder.group({
      join_list:['', Validators.required],
      notified_waitlist:['',Validators.required],
      confirmation_msg:['',Validators.required],
    });
   }

  ngOnInit(): void {
    this.getSignupWaitingList('NEW');
    this.getSignupWaitingList('ALL');
    this.getSignupWaitingList('NOTIFY');
  }

  fnALLSearch(){
    this.getSignupWaitingList('ALL');   
    this.search.keyword;
  }
  fnNewSearch(){
    this.getSignupWaitingList('NEW');   
    this.search.keyword;
  }
  fnNotitySearch(){
    this.getSignupWaitingList('NOTIFY');   
    this.search.keyword;
  }


  fnExportData(){
    
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'waiting-signup-list CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.getAllWaitingListData.data);
   
  }

  getSignupWaitingList(status){
    this.isLoaderAdmin = true;
    let requestObject = {
       'event_id' : this.eventId,
       'boxoffice_id': this.boxofficeId,
       'status': status,
       'search':this.search.keyword,
    }
    this.SingleEventServiceService.getSignupWaitingList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        if(status == 'ALL'){
          this.getAllWaitingListData = response.response ;
        }else if(status == 'NEW'){
          this.getNewWaitingListData = response.response;
        }else{ 
          this.getNotifyWaitingListData = response.response;
        }

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this. getAllWaitingListData = null;
      }
      this.isLoaderAdmin = false;
    })

    
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
     this.waitListForm.get('join_list').markAllAsTouched();
     this.waitListForm.get('notified_waitlist').markAllAsTouched();
     this.waitListForm.get('confirmation_msg').markAllAsTouched();
     return false;
    }
    
     this.waitinglistObject = {
      "active_watlist":this.checkActiveWaitlist,
      "show_ticket":this.showTicket,
      "join_list":this.waitListForm.get('join_list').value,
      "notified_waitlist":this.waitListForm.get('notified_waitlist').value,
      "confirmation_msg":this.waitListForm.get('confirmation_msg').value,
    };

    let requestObject ={
      "boxoffice_id": this.boxofficeId,
      "option_key":'waitListForm',
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
