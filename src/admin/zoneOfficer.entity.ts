import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity()
export class ZoneOfficerEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  zone: string;

  @ManyToOne(() => AdminEntity, admin => admin.zoneOfficers)
  
  admin: AdminEntity;

}



