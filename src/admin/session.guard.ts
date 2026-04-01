import { CanActivate, Injectable,ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
@Injectable()
export class SessionGuard implements CanActivate{
     canActivate(context: ExecutionContext): boolean  {
        const request=context.switchToHttp().getRequest();
        if(request.session.email){
            return true;
        }
        return false;
         
     }
}