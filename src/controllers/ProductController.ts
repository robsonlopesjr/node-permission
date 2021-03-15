import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../repositories/ProductRepository';

class ProductController {
    async create(request: Request, response: Response) {
        const { name, description } = request.body;

        const productRepository = getCustomRepository(ProductRepository);

        const existProduct = await productRepository.findOne({ name });

        if (existProduct) {
          return response.status(400).json({ message: "Product already exists!" });
        }

        const product = productRepository.create({
            name,
            description
        });

        await productRepository.save(product);

        return response.status(201).json(product);
    }

    async index(request: Request, response: Response) {
        const productRepository = getCustomRepository(ProductRepository);

        const products = productRepository.find();

        return response.json(products);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const productRepository = getCustomRepository(ProductRepository);

        const existProduct = await productRepository.findOne({ id });

        if (!existProduct) {
          return response.status(400).json({ message: "Product not found!" });
        }

        return response.json(existProduct);
    }
}

export default ProductController;