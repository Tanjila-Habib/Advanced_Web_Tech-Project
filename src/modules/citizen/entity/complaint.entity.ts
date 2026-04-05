import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Citizen } from './citizen.entity';

@Entity('complaints')
export class Complaint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    corporation: string;

    @Column()
    zone: string;

    @Column()
    ward: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'text', nullable: true })
    feedbackComment: string;

    @Column({ nullable: true })
    feedbackRating: number;

    @ManyToOne(() => Citizen, (citizen) => citizen.complaints, {
        onDelete: 'CASCADE',
    })
    citizen: Citizen;
}