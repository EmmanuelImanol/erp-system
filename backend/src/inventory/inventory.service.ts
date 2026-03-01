import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from './enums/category.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<{ message: string }> {
    const skuExists = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });
    if (skuExists) {
      throw new ConflictException('El SKU ya está registrado');
    }

    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return { message: 'Producto creado correctamente' };
  }

  async findAll(search?: string, category?: string): Promise<Product[]> {
    // 👇 FindOptionsWhere en lugar de any
    const where: FindOptionsWhere<Product> = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }
    if (category) {
      where.category = category as Category;
    }

    return this.productRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findLowStock(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.stock <= product.minStock')
      .orderBy('product.stock', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ message: string }> {
    await this.findById(id);
    await this.productRepository.update(id, updateProductDto);
    return { message: 'Producto actualizado correctamente' };
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.productRepository.delete(id);
    return { message: 'Producto eliminado correctamente' };
  }

  async generateSku(): Promise<{ sku: string }> {
    const count = await this.productRepository.count();
    const sku = `PROD-${String(count + 1).padStart(4, '0')}`;
    return { sku };
  }
}
