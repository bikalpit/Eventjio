import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss']
})
export class TeamAccessComponent implements OnInit {
  teammates = [{name:'unnati',role:'manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'unnati',role:'manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'},
  {name:'unnati',role:'manager',email:'abc@gmail.com',lastseen:'14 Jul 2020 4:30 pm'}
]


  constructor() { }

  ngOnInit(): void {
  }

}
