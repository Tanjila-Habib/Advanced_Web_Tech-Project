import{Controller, Get,Post,Body,Delete, Param,Put, Patch,Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile,Res,HttpException, HttpStatus, Session, UnauthorizedException, UseGuards} from '@nestjs/common'
import { AdminDTO } from './DTO/AdminDTO';
import{AdminService} from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage, MulterError } from 'multer';
import { SessionGuard } from './session.guard';
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
   @UseGuards(SessionGuard)
    @Get('getZoneOfficerby/:id')
    getZoneOfficer(@Param('id')id:number):object{
        return this.adminService.getZoneOfficer(id);
    }
    @UseGuards(SessionGuard)
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
@UseGuards(SessionGuard)
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
getImage(@Param('name') name: string, @Res() res) {
  return res.sendFile(name, { root: './uploads' });
}
    @UseGuards(SessionGuard)
    @Delete('delete/:name')
    deleteAdmin(@Param('name') name:string):object{
        return this.adminService.deleteAdmin(name);
    }
    @UseGuards(SessionGuard)
    @Put('update/:id')
    updateAdmin(@Param('id')id:number, @Body() mydata:AdminDTO):object{
        return this.adminService.updateAdmin(id,mydata);
    }
    @UseGuards(SessionGuard)
    @Patch('partialupdate/:id')
    updateAdminPartial(@Param('id')id:number,@Body()mydata:AdminDTO):object{
        return this.adminService.updateAdminPartial(id,mydata);
    }
    @UseGuards(SessionGuard)
    @Get('search')
    SearchAdmin(@Query('name')name:string):object{
        return this.adminService.searchAdmin(name);
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
    sendMail(@Body('email') email: string) {
  return this.adminService.sendmail(email);
}
     
   }


