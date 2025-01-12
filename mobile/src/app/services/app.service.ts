import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from '../users/user.service'
import { UsersService } from '../users/users.service'


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    public router: Router,
    private usersService: UsersService,
    private userService: UserService,
  ) {}

  public async init() {
    await this.initUsers()
    await this.initUser()
    await this.redirect()
  }

  private async initUsers() {
    await this.usersService.initUsers()
  }

  private async initUser() {
    await this.userService.initUser()
  }

  private async redirect() {
    if (this.userService.user) {
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    } 
  }

}
