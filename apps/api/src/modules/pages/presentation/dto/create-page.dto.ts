import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSectionDto {
  @ApiProperty({ example: 'Hero Section' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: [String],
    example: ['vpc-1', 'vpc-2'],
    description: 'IDs of VPCs associated with this section',
  })
  @IsArray()
  @IsString({ each: true })
  vpcIds!: string[];
}

export class CreatePageDto {
  @ApiProperty({ example: 'Landing Page' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: [String],
    example: ['aud-1', 'aud-2'],
    description: 'IDs of target audiences',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  audienceIds!: string[];

  @ApiProperty({ type: [CreateSectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections!: CreateSectionDto[];
}
