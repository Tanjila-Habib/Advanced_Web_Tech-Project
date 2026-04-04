import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:'mySecretkey',
      signOptions:{expiresIn:'1h'}
    }),
    MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'yourgmail@gmail.com',
      pass: 'your_app_password',
    },
  },
}),
    TypeOrmModule.forFeature([AdminEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService,JwtStrategy],
})
export class AdminModule {}