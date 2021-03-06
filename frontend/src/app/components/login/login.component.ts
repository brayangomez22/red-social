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
        this.title = 'Login';
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
    }

    ngOnInit(): void {
        console.log('Login component loading...');
    }

    onSubmit() {
        this._userService.login(this.user, null).subscribe(
            response => {
                this.identity = response.user;
                console.log(this.identity);

                if (!this.identity || !this.identity._id) {
                    this.status = 'error';
                } else {
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
                    localStorage.setItem('token', JSON.stringify(this.token));
                    this.getCounters();
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

    getCounters() {
        this._userService.getCounters().subscribe(
            response => {
                this.status = 'success';
                localStorage.setItem('stats', JSON.stringify(response));
                this._router.navigate(['/']);
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}
