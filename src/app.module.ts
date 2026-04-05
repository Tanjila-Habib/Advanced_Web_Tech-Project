import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CitizenModule } from './modules/citizen/citizen.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456789',
      database: 'citizen_awp',
      autoLoadEntities: true,
      synchronize: true,
    }),

    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'nazmulislamsifat2001@gmail.com',
          pass: 'rgvsivgjwqegxbjg',
        },
      },
    }),

    CitizenModule,
  ],
})
export class AppModule { }