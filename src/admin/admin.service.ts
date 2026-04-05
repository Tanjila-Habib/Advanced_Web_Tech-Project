import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminDTO } from "./DTO/AdminDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from './admin.entity';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from "@nestjs/jwt";
import { ProfileEntity } from "./profile.entity";

@Injectable()
export class AdminService{
   constructor(
@InjectRepository(AdminEntity)
private adminRepository: Repository<AdminEntity>,
@InjectRepository(ProfileEntity)
private profileRepository:Repository<ProfileEntity>,
 private mailService: MailerService,
 private jwtService:JwtService
) {}
    getAllAdmins(){
        return  this.adminRepository.find();
    }
    getZoneOfficer(id:number):object
    {
        return this.adminRepository.findOneBy({id});
    }
    getEngineer(id:number):object
    {
        return this.adminRepository.findOneBy({id})
    }
     async createAdmin(dto: AdminDTO) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    dto.password = hashedPassword;

    return  this.adminRepository.save(dto);
   
}
    deleteAdmin(name:string){
        return this.adminRepository.delete({name});
    }
    async updateAdmin(id:number,mydata:AdminDTO)
    {  if(mydata.password){
        const salt=await bcrypt.genSalt();
        mydata.password=await bcrypt.hash(mydata.password,salt);
    }
        return this.adminRepository.update(id,mydata);
    }
    updateAdminPartial(id:number,mydata:AdminDTO)
    {  
        return this.adminRepository.update(id,mydata);
    }
    searchAdmin(name:string)
    {
        return this.adminRepository.find({where:{name}});
    }
   async signin(mydata:AdminDTO) {
  const admin = await this.adminRepository.findOneBy({ email: mydata.email });

  if (!admin) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const match = await bcrypt.compare(mydata.password, admin.password);

 if(!match){
   throw new UnauthorizedException('Invalid email or password');
 }

  const payload= { 
    id:admin.id,
    email:admin.email

  };
  const token=this.jwtService.sign(payload);

  return {
    message:"Login Successsful",
    access_token:token
  };
}
async createProfile(mydata)
{
    const admin=await this.adminRepository.findOneBy({id:mydata.adminId});
    if(!admin){
        throw new Error("Admin not found");
    }
    const profile=this.profileRepository.create({
        address:mydata.address,
        department:mydata.department,
        admin:admin

    });
    return this.profileRepository.save(profile);
}
async sendmail(data){
 return   await this.mailService.sendMail({
        to: data.email,
        subject: data.subject,
        text: data.text, 
      });

}
}