import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VpcFieldsDto {
  @ApiProperty({ type: [String], example: ['Scale product quickly'] })
  @IsArray()
  @IsString({ each: true })
  jobs!: string[];

  @ApiProperty({ type: [String], example: ['Limited budget'] })
  @IsArray()
  @IsString({ each: true })
  pains!: string[];

  @ApiProperty({ type: [String], example: ['Rapid user growth'] })
  @IsArray()
  @IsString({ each: true })
  gains!: string[];

  @ApiProperty({ type: [String], example: ['Analytics Dashboard'] })
  @IsArray()
  @IsString({ each: true })
  products!: string[];

  @ApiProperty({ type: [String], example: ['Affordable pricing'] })
  @IsArray()
  @IsString({ each: true })
  painRelievers!: string[];

  @ApiProperty({ type: [String], example: ['Real-time metrics'] })
  @IsArray()
  @IsString({ each: true })
  gainCreators!: string[];
}

export class CreateVpcDto {
  @ApiProperty({ example: 'Startup Founders - Growth' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: VpcFieldsDto })
  @ValidateNested()
  @Type(() => VpcFieldsDto)
  fields!: VpcFieldsDto;
}

export class CreateAudienceDto {
  @ApiProperty({ example: 'Startup Founders' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: [String],
    example: ['doc-1', 'doc-2'],
    description: 'IDs of related documents',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  docIds!: string[];

  @ApiProperty({ type: [CreateVpcDto], required: false, default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVpcDto)
  vpcs!: CreateVpcDto[];
}
