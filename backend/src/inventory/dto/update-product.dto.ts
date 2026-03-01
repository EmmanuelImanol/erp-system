import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../enums/category.enum';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  minStock?: number;

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
