import { EntityRepository, Repository } from "typeorm";
import Role from "../models/Roles";

@EntityRepository(Role)
class RoleRepository extends Repository<Role> {}

export default RoleRepository;