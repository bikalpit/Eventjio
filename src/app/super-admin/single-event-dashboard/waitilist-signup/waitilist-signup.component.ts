import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
@Component({
  selector: 'app-waitilist-signup',
  templateUrl: './waitilist-signup.component.html',
  styleUrls: ['./waitilist-signup.component.scss']
})
export class WaitilistSignupComponent implements OnInit {
  activeWaitlist:boolean=false;
  waitListForm:FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) 
  {
    this.waitListForm =this.formBuilder.group({
      join_list:['',Validators.required],
      notified_waitlist:['',Validators.required],
      confirmation_msg:['',Validators.required],
    });
   }

  ngOnInit(): void {
  }

  fnActiveWaitlist(event){
    this.activeWaitlist=event.checked
  }

  fnSavewaitlist(){
    if(this.waitListForm.invalid){
      alert(1);
    }
    else{
      alert(2);
    }
  }

}
