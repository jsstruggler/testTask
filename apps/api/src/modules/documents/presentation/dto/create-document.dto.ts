import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '@kb/shared-types';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Name of the document',
    example: 'Customer Interview: Startup Founders',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Type of the document',
    enum: DocumentType,
    example: DocumentType.AUDIENCE,
  })
  @IsEnum(DocumentType)
  type!: DocumentType;
}
