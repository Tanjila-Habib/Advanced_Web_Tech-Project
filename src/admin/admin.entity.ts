import { Entity, Column, PrimaryGeneratedColumn,OneToOne, OneToMany} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ZoneOfficerEntity } from './zoneOfficer.entity';
@Entity("admin")
export class AdminEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @Column()
    email:string;
    @Column({select:false})
    
    password:string;
    @Column()
    gender:string;
    @Column()
    phone_number:string;

 @OneToOne(() => ProfileEntity, profile => profile.admin)
  profile: ProfileEntity;

  @OneToMany(()=>ZoneOfficerEntity,officer=>officer.admin)
  zoneOfficers:ZoneOfficerEntity[];


}