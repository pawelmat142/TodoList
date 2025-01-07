import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output() loginEvent = new EventEmitter<void>()
  @Output() toRegisterForm = new EventEmitter<void>()

  constructor(private http: HttpService) {

  }
  
  ngOnInit(): void {

  }


  loginForm = new FormGroup(
    {
      nickname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    },
  )

  submitted = false;

  errorMsg = ''
  message = ''

  get f() { return this.loginForm.controls }

  onSubmit(): void {
    this.submitted = true
    if (this.loginForm.invalid) return
    this.http.login(this.loginForm.value as Partial<User>)
      .subscribe(
        () => this.succes(),
        error => this.failure(error)
    )
  }


  private succes(): void {
    this.submitted = false
    this.loginForm.reset()
    this.message = 'Zalogowano'
    this.loginEvent.emit()
  }

  private failure(error: HttpErrorResponse): void {
    this.errorMsg = error.error.message
    this.loginForm.reset()
    this.submitted = false
    setTimeout(() => { 
      this.errorMsg = ''
    }, 5000)
  }


}
