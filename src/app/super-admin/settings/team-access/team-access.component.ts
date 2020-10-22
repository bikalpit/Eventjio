import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../_services/setting.service';
import { DatePipe } from '@angular/common';
import { ErrorService } from '../../../_services/error.service';
import { environment } from '../../../../environments/environment'

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss'],
  providers: [DatePipe]
})
export class TeamAccessComponent implements OnInit {
  animal: any;
  allBusiness: any;
  isLoaderAdmin: any;
  approvedInviterData: any = [];
  pendingInviterData: any = [];
  boxofficeId: any;



  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private SettingService: SettingService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private change: ChangeDetectorRef
  ) {
    if (localStorage.getItem('boxoffice_id')) {
      this.boxofficeId = localStorage.getItem('boxoffice_id');
    }

  }

  getAPRInviter() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id': this.boxofficeId,
      'status': 'APR'
    }
    this.SettingService.getAllInviter(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.approvedInviterData = response.response
        this.approvedInviterData.forEach(element => {
          element.updated_at = this.datePipe.transform(element.updated_at, "MMM d, y, h:mm a")
        });
        console.log(this.approvedInviterData)
      }
      else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
        this.approvedInviterData.length = 0
        // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  getPENDInviter() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id': this.boxofficeId,
      'status': 'P'
    }
    this.SettingService.getAllInviter(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.pendingInviterData = response.response
        this.pendingInviterData.forEach(element => {
          element.updated_at = this.datePipe.transform(element.updated_at, "MMM d, y, h:mm a")
        });
        console.log(this.pendingInviterData)
      }
      else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
        this.pendingInviterData.length = 0
        // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  ngOnInit(): void {
    this.getAPRInviter();
    this.getPENDInviter();
  }

  inviteTeammate() {
    const dialogRef = this.dialog.open(inviteTeamMateDialog, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getAPRInviter();
      this.getPENDInviter();
    });
  }

}


@Component({
  selector: 'Invite-Team-Mate',
  templateUrl: '../_dialogs/inviteTeamMateDialog.html',
})

export class inviteTeamMateDialog {
  inviteForm: FormGroup;
  isLoaderAdmin: any;
  boxofficeId: any;
  roleType: { 'A', 'EM', 'OM', 'OV' }
  allInviationArr:any = [];

  admin_permission: any;
  em_permission: any;
  om_permission: any;
  view_permission: any;
  email_id: string = '';
  em_sub_permission: any;
  om_AUEC_permission: any;
  om_AUER_permission: any;
  sub_permission: string = '';

  constructor(
    public dialogRef: MatDialogRef<inviteTeamMateDialog>,
    private _formBuilder: FormBuilder,
    private SettingService: SettingService,
    private ErrorService: ErrorService,
    private change: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.boxofficeId = localStorage.getItem('boxoffice_id');

  }

  
  fnOncheckedEM(event) {
    this.admin_permission = false;
    this.em_sub_permission = event.checked;
    this.em_permission = event.checked;
  }

  fnOncheckedOM(event, type) {

    this.admin_permission = false;
    if (type == 'AUEC') {
      this.om_AUEC_permission = event.checked;
    }

    if (type == 'AUER') {
      this.om_AUER_permission = event.checked;
    }

    if (this.om_AUEC_permission || this.om_AUER_permission) {
      this.om_permission = true;
    }

    if (this.om_AUEC_permission == false || this.om_AUER_permission == false) {
      this.om_permission = false;
    }

    this.change.detectChanges();
  }

  fnOnchecked(event, permission) {

    if (permission == 'admin_permission') {

      this.admin_permission = event.checked;

      this.em_permission = false;
      this.om_permission = false;
      this.view_permission = false;
      this.em_sub_permission = false;
      this.om_AUEC_permission = false;
      this.om_AUER_permission = false;


    } else if (permission == 'em_permission') {

      this.em_permission = event.checked;
      this.em_sub_permission = event.checked;
      this.admin_permission = false;

    } else if (permission == 'om_permission') {

      this.om_permission = event.checked;
      this.om_AUEC_permission = event.checked;
      this.om_AUER_permission = event.checked;
      this.admin_permission = false;

    } else if (permission == 'view_permission') {


      this.view_permission = event.checked;
      this.admin_permission = false;

    }
    this.change.detectChanges();

  }


  fnOnSubmit() {

    this.sub_permission = '';
    var permission  = '';

    if (this.admin_permission == true) {
      permission = "A";
    } else {

      var permissions = [];
      var sub_permissions = [];

      if (this.em_permission == true) {
        permissions.push('EM')
        sub_permissions.push('AACD')
      }

      if (this.om_permission == true) {

        permissions.push('OM')

        if (this.om_AUER_permission == true) {
          sub_permissions.push('AUER')
        }

        if (this.om_AUEC_permission == true) {
          sub_permissions.push('AUEC')
        }

      }

      if (this.view_permission == true) {
        permissions.push('OV')
      }

      permission = permissions.toString()
      this.sub_permission = sub_permissions.toString()
    }


    if (this.email_id == '') {
      this.ErrorService.errorMessage('Please enter Email');
      return;
    }

    if (permission == '') {
      this.ErrorService.errorMessage('Plese select any Role');
      return;
    }


    this.isLoaderAdmin = true;

    let inviteFormData = {
      'boxoffice_id': this.boxofficeId,
      "email_id": this.email_id,
      "role": "TM",
      "permission": permission,
      "sub_permission": this.sub_permission,
    }

 

    this.SettingService.inviteform(inviteFormData).subscribe((response: any) => {
      if (response.data == true) {
        this.ErrorService.successMessage(response.response);
        this.dialogRef.close();
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
