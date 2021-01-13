import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service'
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-waitilist-signup',
  templateUrl: './waitilist-signup.component.html',
  styleUrls: ['./waitilist-signup.component.scss']
})
export class WaitilistSignupComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  activeWaitlist:boolean=false;
  waitListForm:FormGroup;
  checkActiveWaitlist:any="N";
  hideLogo:any ="N";
  showTicket:any = "N";
  boxofficeId:any;
  getSavedlist:any;
  eventId:any; 
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


    this.waitListForm =this.formBuilder.group({
      btn_text:['', Validators.required],
      event_page_text:['',Validators.required],
      confirmation_msg:['',Validators.required],
    });
   }

  ngOnInit(): void {
    this.getSignupWaitingList('NEW');
    this.getSignupWaitingList('ALL');
    this.getSignupWaitingList('NOTIFY');
    this. fngetSavedwaitlist();
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
      //  "boxoffice_id":"NULL",
       'status': status,
       'search':this.search.keyword,
    }
    this.SingleEventServiceService.getSignupWaitingList(requestObject).subscribe((response:any) => {

      if(response.data == true && response.response){
        if(status == 'ALL'){
          this.getAllWaitingListData = response.response;
        }else if(status == 'NEW'){
          this.getNewWaitingListData = response.response;
        }else{ 
          this.getNotifyWaitingListData = response.response;
        }
        console.log(status,this.getAllWaitingListData);
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this. getAllWaitingListData = null;
      }
    })
      this.isLoaderAdmin = false;
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
    this.isLoaderAdmin=true;
    if(this.waitListForm.invalid){
     this.waitListForm.get('btn_text').markAllAsTouched();
     this.waitListForm.get('event_page_text').markAllAsTouched();
     this.waitListForm.get('confirmation_msg').markAllAsTouched();
     return false;
    }
    
     this.waitinglistObject = {
      "active_watlist":this.checkActiveWaitlist,
      "show_when_ticket_available":this.showTicket,
      "btn_text":this.waitListForm.get('btn_text').value,
      "event_page_text":this.waitListForm.get('event_page_text').value,
      "confirmation_msg":this.waitListForm.get('confirmation_msg').value,
    };

    let requestObject ={
      "event_id": this.eventId,
      // "boxoffice_id":"NULL",
      "option_key":'waitListForm',
      "option_value":this.waitinglistObject,
      "json_type":"Y",
  }

    this.SingleEventServiceService.setSettingOption(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this.fngetSavedwaitlist();
      
  } else if(response.data == false){
    this.ErrorService.errorMessage(response.response);
    }
});
this.isLoaderAdmin=false;

  }

  fngetSavedwaitlist(){
    this.isLoaderAdmin=true;
    let requestObject= {
      "boxoffice_id":"NULL",
      "option_key":'waitListForm',
      "event_id": this.eventId,
    }
        this.SingleEventServiceService.getSavedlist(requestObject).subscribe((response:any) => {
          if(response.data == true){
          this.getSavedlist = JSON.parse(response.response);       
          this.waitListForm.controls['btn_text'].setValue(this.getSavedlist.btn_text)
          this.waitListForm.controls['event_page_text'].setValue(this.getSavedlist.event_page_text)
          this.waitListForm.controls['confirmation_msg'].setValue(this.getSavedlist.confirmation_msg)
          if(this.getSavedlist.active_watlist == 'Y'){
            this.activeWaitlist = true;
          }else{
              this.activeWaitlist = false;
          }
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        }
    });
    this.isLoaderAdmin=false;
  }

}
