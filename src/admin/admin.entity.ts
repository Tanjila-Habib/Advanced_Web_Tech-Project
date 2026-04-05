import { Entity, Column, PrimaryGeneratedColumn,OneToOne} from 'typeorm';
import { ProfileEntity } from './profile.entity';
@Entity("admin")
export class AdminEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @Column()
    email:string;
    @Column()
    
    password:string;
    @Column()
    gender:string;
    @Column()
    phone_number:string;

 @OneToOne(() => ProfileEntity, profile => profile.admin)
  profile: ProfileEntity;
}