import { Component, OnInit,ViewChild} from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;


  constructor() {
    this.mycontent = `<p>My html content</p>`;
   }

  ngOnInit(): void {
    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true
    };
  }

}
