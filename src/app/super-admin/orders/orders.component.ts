import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['orderid','status','name','datetime','event','value','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}


export interface PeriodicElement {
  orderid: string;
  status: string;
  name: string;
  datetime: string;
  event:string;
  value:string;
  action:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {orderid:'012345',status:'Completed',name:'Shabnam Ansari',datetime:'Jun 22 2020 04:30pm',event:'Lajavab Cooking Classes (Mon 17 Jun 2020)',value:'5000',action:''},
  {orderid:'012345',status:'Void',name:'Shabnam Ansari',datetime:'Jun 22 2020 04:30pm',event:'Lajavab Cooking Classes (Mon 17 Jun 2020)',value:'5000',action:''} 
  ];