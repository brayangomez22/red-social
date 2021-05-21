import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UploadService } from 'src/app/services/upload.service';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [ UserService, PublicationService, UploadService ]
})
export class SidebarComponent implements OnInit {

    public identity;
    public token;
    public stats;
    public status;
    public url;
    public publication: Publication;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _uploadService: UploadService
    ) {
        this.filesToUpload = [];
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
        this.publication = new Publication("", "", "", "", this.identity._id);
    }

    ngOnInit(): void {
    }

    @Output() sended = new EventEmitter();

    onSubmit(form, $event) {
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if (response.publication) {
                    if (this.filesToUpload && this.filesToUpload.length) {
                        this._uploadService.makeFileRequest(
                            this.url + 'upload-image-publication/' + response.publication._id, [], this.filesToUpload, this.token, 'image'
                        ).then((result: any) => {
                            this.publication.file = result.image;
                            this.status = 'success';
                            form.reset();
                            this._router.navigate(['/timeline']); 
                            this.sended.emit({ send: 'true' });
                        });
                    } else {
                        this.status = 'success';
                        form.reset();
                        this._router.navigate(['/timeline']);
                        this.sended.emit({ send: 'true' });
                    }
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
