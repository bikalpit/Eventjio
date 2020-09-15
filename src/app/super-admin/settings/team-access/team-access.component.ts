import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss']
})
export class TeamAccessComponent implements OnInit {

  teammates = [{name:'Meet Shah',role:'Owner',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Monoj Tiwari',role:'Event Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'Parth Bishnoi',role:'Order Manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'}
]

 invite = [{email:'shah.meet@gmail.com',roles:'Order manager',editrole:'Order manager with edit',exportrole:'Order manager with export',lastseen:'Jul 14, 2020 4:44 pm',status:'Pending'},
]


  constructor() { }

  ngOnInit(): void {
  }

}
