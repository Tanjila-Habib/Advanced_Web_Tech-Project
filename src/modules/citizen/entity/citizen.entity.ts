import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Complaint } from './complaint.entity';

@Entity('citizens')
export class Citizen {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @OneToMany(() => Complaint, (complaint) => complaint.citizen)
    complaints: Complaint[];
}