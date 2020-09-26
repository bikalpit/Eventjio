import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss']
})
export class DuplicateComponent implements OnInit {
  duplicateArray = [];
  constructor() { 
    this.duplicateArray.length = 1;
  }

  
  fnAddDuplicate(){
    this.duplicateArray.push(this.duplicateArray.length+1);
  }
  fnRemoveDuplicate(index){
    this.duplicateArray.splice(index,1)
  }
  ngOnInit(): void {
  }

}
