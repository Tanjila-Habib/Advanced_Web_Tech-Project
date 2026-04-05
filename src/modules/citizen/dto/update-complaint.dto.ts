import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class UpdateComplaintDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    corporation?: string;

    @IsOptional()
    @IsString()
    zone?: string;

    @IsOptional()
    @IsString()
    ward?: string;

    @IsOptional()
    @IsString()
    feedbackComment?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    feedbackRating?: number;
}