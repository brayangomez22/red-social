import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [ UserService ]
})
export class SidebarComponent implements OnInit {

    public identity;
    public token;
    public stats;
    public status;
    public url;

    constructor(
        private _userService: UserService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
    }

}
