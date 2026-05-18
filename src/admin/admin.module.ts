import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ProfileEntity } from './profile.entity';
import { ZoneOfficerEntity } from './zoneOfficer.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:'DhakaCityCorporationKey',
      signOptions:{expiresIn:'1h'}
    }),
    MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'tanjilahabib6@gmail.com',
      pass: 'cxeq eppu etkm fuxj',
    },
  },
}),
    TypeOrmModule.forFeature([AdminEntity,ProfileEntity,ZoneOfficerEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService,JwtStrategy],
})
export class AdminModule {}