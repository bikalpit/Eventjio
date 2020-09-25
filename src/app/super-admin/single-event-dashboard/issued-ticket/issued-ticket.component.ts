import { Component, OnInit,ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-issued-ticket',
  templateUrl: './issued-ticket.component.html',
  styleUrls: ['./issued-ticket.component.scss']
})
export class IssuedTicketComponent implements OnInit {
  event_ticket: string[] = ['Select all','General admission'];
  status_ticket: string[] =['All issued ticket','Valid','Void'];
  selected = -1;

  displayedColumns: string[] = ['Ticket_Code','Ticket_Type','name','Orderid','Issued',];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) { }

  orderData = [{Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},
               {Ticket_Code:'5h92H',Ticket_Type:'General Admission',name:'Shabnam Ansari',Orderid:'10771307',Issued:'Jul 22, 2020'},]

  ngOnInit(): void {
  }

  onChange(event) {
    console.log(event)
  }
}


// ------------------------------------- Export Door List Component ---------------------------------



@Component({
  selector: 'app-export-door-list',
  templateUrl: '../_dialogs/export-door-list.html',
})
export class ExportDoorListComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportDoorListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


// ------------------------------------- issued ticket view Component ---------------------------------



@Component({
  selector: 'app-issued-ticket-view',
  templateUrl: '../_dialogs/issued-ticket-view.html',
})
export class IssuedTicketViewComponent {
  voidTicket:boolean = false;
  elementType : 'url' | 'canvas' | 'img' = 'url';
  value : string = '5h92H';
  
  constructor(
    public dialogRef: MatDialogRef<IssuedTicketViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnVoidTicket(){
    this.voidTicket = !this.voidTicket
  }
  ngOnInit() {
  }
 
}


