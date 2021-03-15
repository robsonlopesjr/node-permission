import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';
import RoleRepository from '../repositories/RoleRepository';

class RoleController {
    async create(request: Request, response: Response) {
        const { name, description, permissions } = request.body;

        const roleRepository = getCustomRepository(RoleRepository);
        const permissionRepository = getCustomRepository(PermissionRepository);

        const existRole = await roleRepository.findOne({ name });

        if (existRole) {
          return response.status(400).json({ message: "Role already exists!" });
        }

        const existsPermissions = await permissionRepository.findByIds(permissions);

        const role = roleRepository.create({
            name,
            description,
            permissions: existsPermissions
        });

        await roleRepository.save(role);

        return response.status(201).json(role);
    }
}

export default RoleController;