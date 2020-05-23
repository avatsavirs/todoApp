import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SignupService } from 'src/app/services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  error: any = null;
  errorMsg: string = null;
  signinForm: FormGroup;

  constructor(private signupService: SignupService, private router: Router) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.signinForm.status === 'INVALID') {
      console.error('INVALID FORM');
      return;
    }
    // this.signinForm.reset();
    this.error = null;
    this.signupService.signin(this.signinForm.value)
    .subscribe(res => {
      // console.log(res);
      this.router.navigate(['/']);
    },err => {
      // console.log(err); 
      this.error = err.error.error;
      if (this.error.message==="INVALID_PASSWORD") {
        this.errorMsg = 'Invalid Password'
      }
      if (this.error.message==="EMAIL_NOT_FOUND") {
        this.errorMsg = 'This email is not registered'
      }
    });
  }
}
