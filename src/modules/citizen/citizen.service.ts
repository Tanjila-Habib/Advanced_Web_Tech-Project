import {
    ConflictException,
    Injectable,
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citizen } from './entity/citizen.entity';
import { Complaint } from './entity/complaint.entity';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { LoginDto } from './dto/login.dto';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CitizenService {
    constructor(
        @InjectRepository(Citizen)
        private readonly citizenRepository: Repository<Citizen>,

        @InjectRepository(Complaint)
        private readonly complaintRepository: Repository<Complaint>,

        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) { }

    async register(dto: CreateCitizenDto) {
        const existingCitizen = await this.citizenRepository.findOne({
            where: { email: dto.email },
        });

        if (existingCitizen) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const citizen = this.citizenRepository.create({
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        });

        await this.citizenRepository.save(citizen);

        return {
            message: 'Citizen registered successfully',
            data: {
                id: citizen.id,
                name: citizen.name,
                email: citizen.email,
                phone: citizen.phone,
            },
        };
    }

    async login(dto: LoginDto) {
        const citizen = await this.citizenRepository.findOne({
            where: { email: dto.email },
        });

        if (!citizen) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(
            dto.password,
            citizen.password,
        );

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: citizen.id,
            email: citizen.email,
        };

        return {
            message: 'Login successful',
            access_token: this.jwtService.sign(payload),
        };
    }

    async getProfile(userId: number) {
        const citizen = await this.citizenRepository.findOne({
            where: { id: userId },
        });

        if (!citizen) {
            throw new UnauthorizedException('Citizen not found');
        }

        return {
            id: citizen.id,
            name: citizen.name,
            email: citizen.email,
            phone: citizen.phone,
        };
    }

    async createComplaint(userId: number, dto: CreateComplaintDto) {
        const citizen = await this.citizenRepository.findOne({
            where: { id: userId },
        });

        if (!citizen) {
            throw new NotFoundException('Citizen not found');
        }

        const complaint = this.complaintRepository.create({
            title: dto.title,
            description: dto.description,
            image: dto.image,
            corporation: dto.corporation,
            zone: dto.zone,
            ward: dto.ward,
            citizen,
        });

        await this.complaintRepository.save(complaint);

        await this.mailerService.sendMail({
            to: citizen.email,
            subject: 'Complaint Submitted Successfully',
            text: `Your complaint "${dto.title}" has been submitted successfully.

Corporation: ${dto.corporation}
Zone: ${dto.zone}
Ward: ${dto.ward}
Status: Pending`,
        });

        return {
            message: 'Complaint submitted successfully',
            data: complaint,
        };
    }

    async getMyComplaints(userId: number) {
        const complaints = await this.complaintRepository.find({
            where: {
                citizen: {
                    id: userId,
                },
            },
            order: {
                id: 'DESC',
            },
        });

        return complaints;
    }

    async getComplaintById(id: number, userId: number) {
        const complaint = await this.complaintRepository.findOne({
            where: { id },
            relations: ['citizen'],
        });

        if (!complaint) {
            throw new NotFoundException('Complaint not found');
        }

        if (complaint.citizen.id !== userId) {
            throw new ForbiddenException(
                'You are not allowed to access this complaint',
            );
        }

        return complaint;
    }

    async updateComplaint(
        id: number,
        userId: number,
        dto: UpdateComplaintDto,
    ) {
        const complaint = await this.complaintRepository.findOne({
            where: { id },
            relations: ['citizen'],
        });

        if (!complaint) {
            throw new NotFoundException('Complaint not found');
        }

        if (complaint.citizen.id !== userId) {
            throw new ForbiddenException(
                'You are not allowed to update this complaint',
            );
        }

        if (dto.title !== undefined) complaint.title = dto.title;
        if (dto.description !== undefined) complaint.description = dto.description;
        if (dto.image !== undefined) complaint.image = dto.image;
        if (dto.corporation !== undefined) complaint.corporation = dto.corporation;
        if (dto.zone !== undefined) complaint.zone = dto.zone;
        if (dto.ward !== undefined) complaint.ward = dto.ward;
        if (dto.feedbackComment !== undefined)
            complaint.feedbackComment = dto.feedbackComment;
        if (dto.feedbackRating !== undefined)
            complaint.feedbackRating = dto.feedbackRating;

        await this.complaintRepository.save(complaint);

        delete (complaint.citizen as any).password;

        return {
            message: 'Complaint updated successfully',
            data: complaint,
        };
    }

    async deleteComplaint(id: number, userId: number) {
        const complaint = await this.complaintRepository.findOne({
            where: { id },
            relations: ['citizen'],
        });

        if (!complaint) {
            throw new NotFoundException('Complaint not found');
        }

        if (complaint.citizen.id !== userId) {
            throw new ForbiddenException(
                'You are not allowed to delete this complaint',
            );
        }

        await this.complaintRepository.remove(complaint);

        return {
            message: 'Complaint deleted successfully',
        };
    }
}