import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
confirmationType :any ='GlobalOrderConfirmation';
attachInvoice = true;
  constructor() { }

  ngOnInit(): void {

  }

  fnEditOrderConfirmation(event){
    this.confirmationType = event.value;
  }

}
