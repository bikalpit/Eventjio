import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  
 addNewEvents : boolean = true;
  
  upcomingEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},]
 
                pastEventData = [{event:'Lajawab Cooking Classes',status:'Draft',sold:'00',remaining:'00',revenue:'$.00.00',togglebtn:''},
                {event:'Draculla Drinks',status:'Published',sold:'20',remaining:'200',revenue:'$.2000.00',togglebtn:''},
                ]

  
  constructor(public dialog: MatDialog) { }
  openAddNewTicketTypeDialog() {
    const dialogRef = this.dialog.open(AddNewTicketType,{
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddNewTicketGroupDialog() {
    const dialogRef = this.dialog.open(AddNewTicketGroup,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  fnAddNewEventsForm(){
    this.addNewEvents = !this.addNewEvents;
  }
  ngOnInit(): void {
    
  }

}


@Component({
  selector: 'add-new-ticket-type',
  templateUrl: '../_dialogs/add-new-ticket-type.html',
})
export class AddNewTicketType {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


@Component({
  selector: 'add-new-ticket-group',
  templateUrl: '../_dialogs/add-new-ticket-group.html',
})
export class AddNewTicketGroup {
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketGroup>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}