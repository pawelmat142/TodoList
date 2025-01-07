import { Component, Output, EventEmitter } from '@angular/core';
import { RegisterForm } from 'src/app/models/registerForm';
import { HttpService } from 'src/app/services/http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../providers/validators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  @Output() closeEvent = new EventEmitter<void>()
  
  constructor(private http: HttpService) { }

  registerForm = new FormGroup(
    {
      nickname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.maxLength(60)]),
    },
    CustomValidators.mustMatch('password', 'confirmPassword')
  )

  submitted = false;

  errorMsg = ''
  message = ''

  get f() { return this.registerForm.controls }

  onSubmit(): void {
    this.submitted = true
    if (this.registerForm.invalid) return
    this.http.register(this.registerForm.value as RegisterForm)
      .subscribe(
        () => this.succes(),
        error => this.failure(error)
    )
  }

  private succes(): void {
    this.submitted = false
    this.registerForm.reset()
    this.message = 'Rejesracja przebiegła pomyślnie'
    setTimeout(() => this.closeEvent.emit(),2000)
  }

  private failure(error: HttpErrorResponse): void {
    this.errorMsg = error.error.message
    this.registerForm.reset()
    this.submitted = false
    setTimeout(() => { 
      this.errorMsg = ''
    }, 5000)
  }

}
