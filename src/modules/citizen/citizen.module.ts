import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { Citizen } from './entity/citizen.entity';
import { Complaint } from './entity/complaint.entity';
import { JwtStrategy } from '../../auth/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Citizen, Complaint]),
        JwtModule.register({
            secret: 'mySecretKey',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [CitizenController],
    providers: [CitizenService, JwtStrategy],
})
export class CitizenModule { }