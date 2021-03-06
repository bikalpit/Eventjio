import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {

  buyerQuestion = [{persondetail:'Name'},{persondetail:'Email'},{persondetail:'Mobile Phone Number'},{persondetail:'Address'}]

    drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.buyerQuestion, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

}
