import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss']
})
export class TeamAccessComponent implements OnInit {
  animal :any;
  allBusiness: any;

  teammates = [{name:'Meet Shah',role:'Owner',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Monoj Tiwari',role:'Event Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Parth Bishnoi',role:'Order Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'}
]

 invite = [{email:'shah.meet@gmail.com',roles:'Order manager',editrole:'Order manager with edit',exportrole:'Order manager with export',lastseen:'Jul 14, 2020 4:44 pm',status:'Pending'},
]


  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }
  inviteTeammate() {
    const dialogRef = this.dialog.open(inviteTeamMateDialog, {
      width: '550px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  }

  @Component({
    selector: 'Invite-Team-Mate',
    templateUrl: '../_dialogs/inviteTeamMateDialog.html',
  })
  export class inviteTeamMateDialog { 
    
    constructor(
      public dialogRef: MatDialogRef<inviteTeamMateDialog>,
      private http: HttpClient,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit() {
    }
    
  }
  