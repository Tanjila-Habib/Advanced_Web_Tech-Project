import{Controller, Get,Post,Body,Delete, Param,Put, Patch,Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile,Res,HttpException, HttpStatus, UnauthorizedException, UseGuards} from '@nestjs/common'
import { AdminDTO } from './DTO/AdminDTO';
import{AdminService} from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage, MulterError } from 'multer';

import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController{
     constructor(private readonly adminService: AdminService) {}
    
    @UseGuards(AuthGuard('jwt'))
   @Get('getAllAdmin')
async getAllAdmins() {
  try {
    return await this.adminService.getAllAdmins();
  } catch (error) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to fetch admins',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
    @UseGuards(AuthGuard('jwt'))
    @Get('getZoneOfficerby/:id')
    getZoneOfficer(@Param('id')id:number):object{
        return this.adminService.getZoneOfficer(id);
    }
     @UseGuards(AuthGuard('jwt'))
    @Get('getEngineerby/:id')
    getEngineer(@Param('id')id:number):object{
        return this.adminService.getEngineer(id);
    }
    @Post('createAdmin')
    @UsePipes(new ValidationPipe())
    createAdmin(@Body() dto:AdminDTO):object
    {
        return this.adminService.createAdmin(dto);
        
    } 
@UseGuards(AuthGuard('jwt'))
 @Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 300000 }, // 300KB
  }),
)
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    message: 'File uploaded successfully',
    filename: file.filename,
  };
}

@Get('getimage/:name')
getImage(@Param('name') name: string, @Res() res:Response) {
  return res.sendFile(name, { root: './uploads' });
}
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:name')
    deleteAdmin(@Param('name') name:string):object{
        return this.adminService.deleteAdmin(name);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    updateAdmin(@Param('id')id:number, @Body() mydata:AdminDTO):object{
        return this.adminService.updateAdmin(id,mydata);
    }
    @UseGuards(AuthGuard('jwt'))
    @Patch('partialupdate/:id')
    updateAdminPartial(@Param('id')id:number,@Body()mydata:AdminDTO):object{
        return this.adminService.updateAdminPartial(id,mydata);
    }
     @UseGuards(AuthGuard('jwt'))
    @Get('search')
    SearchAdmin(@Query('name')name:string):object{
        return this.adminService.searchAdmin(name);
    }
@UseGuards(AuthGuard('jwt'))
  @Post('createProfile')
  createProfile(@Body() data){
    return this.adminService.createProfile(data);
  }
   @Post('createOfficer')
createOfficer(@Body() data){
 return this.adminService.createOfficer(data);
}
@Get('officers')
getOfficers(){
 return this.adminService.getOfficers();
} 
@Delete('officer/:id')
deleteOfficer(@Param('id') id:number){
 return this.adminService.deleteOfficer(id);
}
 @Post('signin')
async signin(@Body() mydto: AdminDTO) {

  const result = await this.adminService.signin(mydto);

  if (!result) {
    throw new UnauthorizedException("Invalid credentials");
  }

  return result;
}
@Post('sendmail')
sendMail(@Body() data) {
  return this.adminService.sendmail(data);
}
     
   }


