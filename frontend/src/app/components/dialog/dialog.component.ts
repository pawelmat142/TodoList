import { Component, HostBinding, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  text: String = ''
  @HostBinding('class.active') isActive: boolean = false
  @HostBinding('class.hide') hide: boolean = false

  constructor(private dialogService: DialogService) { 

    this.dialogService.getText().subscribe(
      (text: String) => this.text = text,
      (error: Error) => console.log(error)
    )

    this.dialogService.isActive().subscribe(
      (active: boolean) => this.isActive = active,
      (error: Error) => console.log(error)
    )

    this.dialogService.isHide().subscribe(
      (hide: boolean) => this.hide = hide,
      (error: Error) => console.log(error)
    )

  }

  confirm(): void { 
    this.dialogService.confirm()
  }

  close(): void {
    this.dialogService.close()
  }

  ngOnInit(): void {
  }

}
