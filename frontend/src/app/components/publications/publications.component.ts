import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/app/models/publication';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-publications',
    templateUrl: './publications.component.html',
    styleUrls: ['./publications.component.scss'],
    providers: [ UserService, PublicationService ]
})
export class PublicationsComponent implements OnInit {

    public title: string;
    public identity;
    public token;
    public url: string;
    public status;
    public page;
    public total;
    public pages;
    public itemsPerPage;
    public publications: Publication[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ) {
        this.title = 'Publications';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.publications = [];
    }

    ngOnInit(): void {
        this.getPublications(this.page); 
    }

    getPublications(page, adding = false) {
        this._publicationService.getPublications(this.token, page).subscribe(
            response => {
                if (response.publications) {
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.items_per_page;

                    if (!adding) {
                        this.publications = response.publications;
                    } else {
                        let arrayA = this.publications;
                        let arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $("html, body").animate({ scrollTop: $('body').prop('scrollHeight') }, 500);
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

    public noMore = false;
    viewMore(){
        this.page += 1;
        if(this.page == this.pages){
            this.noMore = true;
        }
        this.getPublications(this.page, true);
    }
}
