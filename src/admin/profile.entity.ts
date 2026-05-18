import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity()
export class ProfileEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  department: string;

  @OneToOne(() => AdminEntity, admin => admin.profile)
  @JoinColumn()
  admin: AdminEntity;

}