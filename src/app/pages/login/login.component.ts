import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    "username" : '',
    "password" : '',
  }

  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  formSubmit() {
    if (!this.loginData.username || !this.loginData.username.trim()) {
      this.snack.open('El nombre de usuario es requerido !!', 'Aceptar', { duration: 3000 });
      return;
    }

    if (!this.loginData.password || !this.loginData.password.trim()) {
      this.snack.open('La contraseña es requerida !!', 'Aceptar', { duration: 3000 });
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log(data);
        this.loginService.loginUser(data.token);
        this.loginService.getCurrentUser().subscribe((user: any) => {
          this.loginService.setUser(user);
          console.log(user);

          const userRole = this.loginService.getUserRole();

          if (userRole === 'Estudiante') {
            this.router.navigate(['user-dashboard']); // Redirigir al dashboard del estudiante
            this.loginService.loginStatusSubjec.next(true);
          } else if (userRole === 'Admin') {
            this.router.navigate(['admin']); // Redirigir al dashboard del administrador
            this.loginService.loginStatusSubjec.next(true);
          } else {
            this.loginService.logout(); // Cerrar sesión si el rol no es válido
          }
        });
      },
      (error) => {
        console.log(error);
        this.snack.open('Detalles inválidos, vuelva a intentar !!', 'Aceptar', { duration: 3000 });
      }
    );
  }
}
