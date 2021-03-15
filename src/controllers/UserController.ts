import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import UserRepository from '../repositories/UserRepository';
import RoleRepository from '../repositories/RoleRepository';
import { decode } from 'jsonwebtoken';

class UserController {
    async create(request: Request, response: Response) {
        const { name, username, password, roles } = request.body;

        const userRepository = getCustomRepository(UserRepository);
        const roleRepository = getCustomRepository(RoleRepository);

        const existUser = await userRepository.findOne({ username });

        if (existUser) {
          return response.status(400).json({ message: "User already exists!" });
        }

        const existsRoles = await roleRepository.findByIds(roles);

        const passwordHash = await hash(password, 8);

        const user = userRepository.create({
            name,
            username,
            password: passwordHash,
            roles: existsRoles
        });

        await userRepository.save(user);

        return response.status(201).json(user);
    }

    async roles(request: Request, response: Response) {
        const authHeader = request.headers.authorization || "";

        const userRepository = getCustomRepository(UserRepository);

        const [, token] = authHeader?.split(' ');

        try {
            if(!token) {
                return response.status(401).json({message: 'Not authorized!'});
            }

            const payload = decode(token);

            if(!payload) {
                return response.status(401).json({message: 'Not authorized!'});
            }

            const user = await userRepository.findOne(payload?.sub, {
                relations: ['roles']
            });

            const roles = user?.roles.map(role => role.name);

            return response.json(roles);
        } catch (err) {
            return response.status(400).send();
        }
    }
}

export default UserController