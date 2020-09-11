import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {

  buyerQuestion = [{persondetail:'Name'},{persondetail:'Email'},{persondetail:'Mobile Phone Number'},{persondetail:'Address'}]
  constructor() { }

  ngOnInit(): void {
  }

}
