import { Injectable } from "@nestjs/common";
import { AdminDTO } from "./DTO/AdminDTO";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from './admin.entity';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService{
   constructor(
@InjectRepository(AdminEntity)
private adminRepository: Repository<AdminEntity>,
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

    const admin = this.adminRepository.create(dto);
    const savedAdmin = await this.adminRepository.save(admin);

    savedAdmin.password="";
    return savedAdmin;
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
}