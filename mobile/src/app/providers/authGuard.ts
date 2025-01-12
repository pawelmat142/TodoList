import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { UserService } from 'src/app/users/user.service'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        public router: Router,
        private userService: UserService,
    ) {}

    canActivate(): boolean {
        const result = !!this.userService.user
        if (!result) {
            this.router.navigateByUrl('/start', { replaceUrl: true })
        }
        return result
    }
}