import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; 

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    providers: [ UserService ]
})
export class UserEditComponent implements OnInit {

    public title: string;
    public identity;
    public user: User;
    public token;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService
    ) {
        this.status = '';
        this.title = 'Update my data';
        this.user = this._useService.getIdentity();
        this.identity = this.user;
        this.token = this._useService.getToken();
    }

    ngOnInit(): void {
        console.log(this.user);
    }

}
