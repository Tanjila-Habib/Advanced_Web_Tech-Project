import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { LoginDto } from './dto/login.dto';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Controller('citizen')
export class CitizenController {
    constructor(private readonly citizenService: CitizenService) { }

    @Post('register')
    register(@Body() dto: CreateCitizenDto) {
        return this.citizenService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.citizenService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.citizenService.getProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('complaints')
    createComplaint(@Req() req, @Body() dto: CreateComplaintDto) {
        return this.citizenService.createComplaint(req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('complaints')
    getMyComplaints(@Req() req) {
        return this.citizenService.getMyComplaints(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('complaints/:id')
    getComplaintById(@Param('id') id: string, @Req() req) {
        return this.citizenService.getComplaintById(Number(id), req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('complaints/:id')
    updateComplaint(
        @Param('id') id: string,
        @Req() req,
        @Body() dto: UpdateComplaintDto,
    ) {
        return this.citizenService.updateComplaint(Number(id), req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('complaints/:id')
    deleteComplaint(@Param('id') id: string, @Req() req) {
        return this.citizenService.deleteComplaint(Number(id), req.user.userId);
    }
}