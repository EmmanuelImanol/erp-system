import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  MinLength,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../enums/category.enum';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  sku: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minStock: number;

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
