import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-btn.component.html',
  styleUrls: [
    './icon-btn.component.scss',
    '../../../assets/flaticon/flaticon.scss'
  ]
})
export class IconBtnComponent implements OnChanges, OnInit {

  @Input() icon: string
  @Input() color: string
  _icon: string
  
  animating: boolean = false

  animationDuration: number = 200

  icons = {
    back: 'flaticon-arrow',
    add: 'flaticon-add-button',
    remove: 'flaticon-trash',
    ok: 'flaticon-tick',
    important: 'flaticon-warning',
    gear: 'flaticon-gear',
    internet: 'flaticon-internet-gear',
    user: 'flaticon-user',
    error: 'flaticon-close',
    warning: 'flaticon-warning',
    question: 'flaticon-question',
    logout: 'flaticon-logout',
    edit: 'flaticon-edit',
    menu: 'flaticon-paragraph',
    notes: 'flaticon-notes',
    list: 'flaticon-list',
    comment: 'flaticon-comment',
    smartphone: 'flaticon-smartphone-1',
    switch: 'flaticon-switch'
  }

  classes = (): Array<string> => [
    this.icons[this._icon],
    this.color ? this.color : 'white'
  ]
  
  ngOnInit(): void {
    this.isIconAvailable(this.icon)
    this._icon = this.icon;
  }


  ngOnChanges(change: SimpleChanges): void {
    if (!change.icon.firstChange) {
      const newIcon = change['icon'].currentValue
      this.isIconAvailable(newIcon)
      this.animating = !this.animating
      setTimeout(() =>
        this.animating = !this.animating,
        this.animationDuration
      )
      setTimeout(() =>
        this._icon = newIcon,
        this.animationDuration / 2
      )
    }
  }


  isIconAvailable(icon: string): void { 
    if (!Object.keys(this.icons).includes(icon)) { 
      throw new Error('IconBtnComponent - no icon available')
    }
  }
  
}
