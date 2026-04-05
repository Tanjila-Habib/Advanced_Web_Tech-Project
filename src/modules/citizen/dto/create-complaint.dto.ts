import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComplaintDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsString()
    @IsNotEmpty()
    corporation: string;

    @IsString()
    @IsNotEmpty()
    zone: string;

    @IsString()
    @IsNotEmpty()
    ward: string;
}