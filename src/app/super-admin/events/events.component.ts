import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['Event','Status','Sold','Remaining','Revenue','Togglebtn'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  

}
export interface PeriodicElement {
  Event: string;
  Status: string;
  Sold: string;
  Remaining: string;
  Revenue:string;
  Togglebtn:string;
} 

const ELEMENT_DATA: PeriodicElement[] = [
{Event:'test',Status:'Waiting',Sold:'00',Remaining:'00',Revenue:'00',Togglebtn:''}
  
];