import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public title: string;
    public user: User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.title = 'Registrate';
        this.user = new User(
            "",
            "",
            "",
            "",
            "",
            "",
            "ROLE_USER",
            ""
        );
    }

    ngOnInit(): void {
        console.log("Componente de registro cargando...");
    }

    onSubmit() {
        console.log(this.user);
    }
}
