import { Injectable } from "@angular/core";
import { UserService } from "./user.service"; 
import { Router, CanActivate } from "@angular/router"; 

@Injectable()
export class UserGuard implements CanActivate {
    
    constructor(
        private _router: Router,
        private _userService: UserService,
    ) {}

    canActivate() {
        let identity = this._userService.getIdentity();

        if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }

}