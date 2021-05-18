import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ UserService ]
})
export class LoginComponent implements OnInit {

    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.status = '';
        this.title = 'Identificate';
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
    }

    ngOnInit(): void {
        console.log("Componente de login cargando...");
    }

    onSubmit() {
        this._userService.login(this.user, null).subscribe(
            response => {
                this.identity = response.user;
                console.log(this.identity);

                if (!this.identity || !this.identity._id) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    this.getToken();
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);
                
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getToken() {
        this._userService.login(this.user, 'true').subscribe(
            response => {
                this.token = response.token;
                console.log(this.token);

                if (this.token.length <= 0) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('token', JSON.stringify(this.token));
                    this._router.navigate(['/']);
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);
                
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
}
