import { Component, OnInit } from '@angular/core'
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private readonly appService: AppService) {}

  ngOnInit(): void {
    this.appService.init()
  }
  
}
