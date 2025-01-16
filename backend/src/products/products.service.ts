import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // Criação do produto
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;

    // Verificando se a categoria existe
    const category = await this.categoriesRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Criando e salvando o produto
    const product = this.productsRepository.create({ ...rest, category });
    return this.productsRepository.save(product);
  }

  // Buscar todos os produtos
  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  // Buscar produto por ID
  async findProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  // Atualizar produto
  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = updateProductDto;

    // Verificando e atribuindo nova categoria, se necessário
    if (categoryId) {
      const category = await this.categoriesRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
      product.category = category;
    }

    // Atualizando as informações do produto
    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  // Remover produto
  async removeProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
  }

  // Criação da categoria
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  // Buscar todas as categorias
  async findAllCategories(): Promise<Category[]> {
      return this.categoriesRepository.find();
  }

  // Buscar categoria por ID
  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return category;
  }

  // Atualizar categoria
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  // Remover categoria
  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }
}
