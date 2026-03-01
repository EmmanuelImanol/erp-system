import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Category } from './enums/category.enum';

@Controller('inventory')
@UseGuards(JwtGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createProductDto: CreateProductDto) {
    return this.inventoryService.create(createProductDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.inventoryService.findAll(search, category);
  }

  @Get('categories')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  getCategories() {
    return Object.values(Category);
  }

  @Get('generate-sku')
  @Roles(Role.ADMIN, Role.MANAGER)
  generateSku() {
    return this.inventoryService.generateSku();
  }

  @Get('low-stock')
  @Roles(Role.ADMIN, Role.MANAGER)
  findLowStock() {
    return this.inventoryService.findLowStock();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.inventoryService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.remove(id);
  }
}
