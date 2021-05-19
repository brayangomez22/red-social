import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [ UserService ]
})
export class RegisterComponent implements OnInit {

    public title: string;
    public user: User;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.status = "";
        this.title = 'Sign up';
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
    }

    ngOnInit(): void {
        console.log('Registration component loading...');
    }

    onSubmit(form: { reset: () => void; }) {
        this._userService.register(this.user).subscribe(
            response => {
                if (response.user && response.user._id) {
                    this.status = 'success';
                    form.reset();
                } else {
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}
