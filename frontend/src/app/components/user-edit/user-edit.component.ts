import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UploadService } from 'src/app/services/upload.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    providers: [ UserService, UploadService ]
})
export class UserEditComponent implements OnInit {

    public title: string;
    public identity;
    public user: User;
    public token;
    public status: string;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService,
        private _uploadService: UploadService
    ) {
        this.filesToUpload = [];
        this.status = '';
        this.title = 'Update my data';
        this.user = this._useService.getIdentity();
        this.identity = this.user;
        this.token = this._useService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        console.log(this.user);
    }

    onSubmit() {
        console.log(this.user);
        this._useService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;
                    this._uploadService.makeFileRequest(
                        this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image'
                    ).then((result: any) => {
                        this.user.image = result.user.image;
                        localStorage.setItem('identity', JSON.stringify(this.user));
                    });
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
