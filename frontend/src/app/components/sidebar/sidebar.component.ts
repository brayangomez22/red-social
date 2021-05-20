import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [ UserService, PublicationService ]
})
export class SidebarComponent implements OnInit {

    public identity;
    public token;
    public stats;
    public status;
    public url;
    public publication: Publication;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
        this.publication = new Publication("", "", "", "", this.identity._id);
    }

    ngOnInit(): void {
    }

    onSubmit(form) {
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if (response.publication) {
                    this.publication = response.publication;
                    this.status = 'success';
                    form.reset();
                    this._router.navigate(['/timeline']);
                } else {
                    this.status = 'error';
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

    @Output() sended = new EventEmitter();

    sendPublication(event) {
        this.sended.emit({ send: 'true' });
    }
}
