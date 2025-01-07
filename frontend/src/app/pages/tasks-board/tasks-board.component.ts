import { Component, ElementRef, OnInit, AfterViewInit, QueryList, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { TaskComponent } from 'src/app/components/task/task.component';
import { Action } from 'src/app/models/action';
import { ActionStyles } from 'src/app/models/actionStyles';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';


@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrls: ['./tasks-board.component.scss']
})
export class TasksBoardComponent implements OnInit, AfterViewInit {

  @Output() menuEvent = new EventEmitter<void>()
  @Output() fistTaskEvent = new EventEmitter<void>()
  @Output() editEvent = new EventEmitter<void>()

  tasks: Task[]

  constructor(private tasksService: TasksService) { 

  }


  @ViewChildren(TaskComponent, { read: ElementRef })
  taskElementsRefs: QueryList<ElementRef>

  @ViewChildren(TaskComponent)
  taskQueryList: QueryList<TaskComponent>

  isActive: boolean = false
  isPressed: boolean = false
  action: Action
  distance: number    //distance betweeen every 2 tasks
  skipDuration: number = 200
  stopTransition: boolean = false

  
  ngOnInit() {
    this.initAction() // sets Action object init state
    this.tasksService.loadTasks()
    this.tasksService.getTasks()
      .subscribe((data: Task[]) => { 
        this.tasks = data
      })
  }
  
  
  ngAfterViewInit(): void {
    this.taskElementsRefs.changes.subscribe((element: ElementRef) =>
      this.distance = this.getDistance(element))
  }


  removeTask(i: number): void {
    this.tasks = this.tasks.filter((t, index) => i !== index)
  }


  onStart(x: number, y: number, i: number): void {
    this.action.i = i
    this.isPressed = true
    this.action.xStart = x
    this.action.yStart = y
    this.action.timestamp = Date.now()

    setTimeout(() => { 
      if (this.isPressed &&
        this.allTasksClosed() &&
        Math.abs(this.action.dx) < 8 &&
        Math.abs(this.action.dy) < 8
        ) { 
          this.isActive = true
          this.action.toSkip = 0
          this.action.iToSkip = []
      }
    },100)
  }


  onStop(): void {

    if ((Date.now() - this.action.timestamp) < 500) {
      if (Math.abs(this.action.dx) < 5 && Math.abs(this.action.dy) < 5) { 
        this.onClick(this.action.i)
      }
    }

    if (Math.abs(this.action.dx) > 200 && this.isActive) {
      (this.taskQueryList.find((el, i) => i === this.action.i).deleteTask())
      this.isActive = false
      this.isPressed = false
      this.clearAction()
      // this.action.dx = 0
      // this.action.dy = 0
      return
    }

    this.isPressed = false
    this.action.dx = 0
    this.action.dy = 0

    if (this.isActive) { 
      this.isActive = false
      this.reorder()
      this.action.iToSkip.push(this.action.i)
    }
  }

  
  onMove(x: number, y: number): void {
    if (this.isPressed) { 
      this.action.dx = x - this.action.xStart
      this.action.dy = y - this.action.yStart
    }

    if (this.isActive) {
      let toSkip: number = this.action.dy > 0 ?
        Math.floor(this.action.dy / this.distance) :
        Math.ceil(this.action.dy / this.distance)
      
      if (toSkip !== this.action.toSkip) {
        if ( (this.action.i + toSkip) <= (this.tasks.length - 1)
          && (this.action.i + toSkip) >= 0)
        { 
          this.action.toSkip = toSkip
          this.skip()
        }
      }
    }
    
  }


  classes(i: number): string {
    let result = ''
    if (this.isPressed && this.action.i === i) { 
      result = 'pressed'
    }
    if (this.isActive && this.action.i === i) { 
      result = 'active'
    }
    return result 
  }


  activeStyles(): ActionStyles {
    return {
      transition: 'unset',
      transform: `translate(${this.action.dx}px, ${this.action.dy}px)`,
      zIndex: 999,
      cursor: (this.action.dx > 10 || this.action.dy > 10)? 'move' : 'pointer'
    }
  }
  

  skipStyles(i: number): ActionStyles {
    let toSkip = this.distance * (this.action.i > i ? 1 : -1)
    if (this.action.i === i) toSkip = this.action.toSkip * this.distance
    return {
      transition: `.${this.skipDuration/100}s ease`,
      transform: `translateY(${toSkip}px)`,
      zIndex: 1,
    }
  }


  private initAction(): void { 
    this.action = {
      i: -1,
      iToSkip: [],
      dx: 0,
      dy: 0,
      xStart: 0,
      yStart: 0,
      toSkip: 0,
      timestamp: 0,
    }
  }

  private clearAction(): void { 
    this.action.i = -1,
    this.action.iToSkip = [],
    this.action.xStart = 0,
    this.action.yStart = 0,
    this.action.toSkip = 0
  }


  private skip(): void {
    this.action.iToSkip = []
    for (let i = Math.abs(this.action.toSkip); i > 0; i--) {
      const toPush = this.action.i + (this.action.toSkip > 0 ? i : -i)
      this.action.iToSkip.push(toPush)
    }
  }


  private async reorder() {
    // const prevTasks = JSON.parse(JSON.stringify(this.tasks))
    let newTasks = []
    let tasksYs = this.taskElementsRefs.map(task =>
      task.nativeElement.getBoundingClientRect().y)
    setTimeout(() => { 
      this.tasks.forEach(task => {
        const iMin = tasksYs.indexOf(Math.min(...tasksYs))
        tasksYs[iMin] = Infinity
        newTasks.push(this.tasks[iMin])
        
      })
      this.tasksService.reorder(newTasks)
      this.clearAction()
      this.stopTransition = true
      this.tasks = newTasks
      setTimeout(() => this.stopTransition = false, this.skipDuration)
    }, this.skipDuration)
  }


  private getDistance(element: ElementRef): number { 
    if (this.taskElementsRefs.length > 1) {
      return element['_results'][1].nativeElement.getBoundingClientRect().y -
        element['_results'][0].nativeElement.getBoundingClientRect().y
    } else return 0
  }


  private onClick(taskIndex: number): void {
    this.taskQueryList.find((el, i) => i === taskIndex).onClick()
  }


  private allTasksClosed(): boolean {
    return !this.taskQueryList.find(task => !!task.visible)
  }


  isMobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  }

}
