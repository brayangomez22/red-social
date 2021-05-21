import { Component, OnInit } from '@angular/core';
import { Follow } from 'src/app/models/follow';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from 'src/app/services/follow.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    providers: [ MessageService, FollowService, UserService ]
})
export class AddComponent implements OnInit {

    public title: string;
    public message: Message;
    public url: string;
    public identity;
    public token;
    public status;
    public follows;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _followService: FollowService,
        private _userService: UserService
    ) {
        this.title = 'Send Messages';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message('', '', '', '', this.identity._id, ''); 
    }

    ngOnInit(): void {
        this.getMyFollows();
    }

    onSubmit(form) {
        this._messageService.addMessage(this.token, this.message).subscribe(
            response => {
                if (response.message) {
                    this.status = 'success';
                    form.reset();
                }
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }

    getMyFollows() {
        this._followService.getMyFollows(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },  
            error => {
                console.log(<any>error);
            }
        );
    }

}
