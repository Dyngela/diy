import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../../shared-module/core/services/authentication.service";
import {CurrentUserService} from "../../../../shared-module/core/services/current-user.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  formBuilder = inject(FormBuilder)
  authService = inject(AuthenticationService)
  currentUserService = inject(CurrentUserService)
  toastService = inject(MessageService)
  router = inject(Router)
  form: any;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('invalid form')
      return
    }

    this.authService.login(this.form.value.email, this.form.value.password, "830e70ce-d25d-4f16-a6e6-5e5e88d4d30e").subscribe({
      next: (response) => {
        this.currentUserService.storeTokensAndRefreshToken(response.token, response.refreshToken);
        this.toastService.add({severity: 'success', summary: 'Success', detail: 'Login successful'});
        this.router.navigate(['']);
      },
      error: (error) => {
        this.toastService.add({severity: 'error', summary: 'Error', detail: error.message || 'An error occurred'});
      }
    });
  }
}
