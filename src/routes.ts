import { Router } from "express";

import { is } from "./middlewares/permission";

import PermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import ProductController from "./controllers/ProductController";

const router = Router();

const userController = new UserController;
const sessionController = new SessionController;
const permissionControllera = new PermissionController;
const roleController = new RoleController;
const productController = new ProductController;

router.post('/users', userController.create);
router.post('/sessions', sessionController.create);
router.post('/permissions', permissionControllera.create);
router.post('/roles', roleController.create);

router.get('/users/roles', userController.roles);

router.post("/products", is(["ROLE_ADMIN"]), productController.create);
router.get(
  "/products",
  is(["ROLE_ADMIN", "ROLE_USER"]),
  productController.index
);
router.get(
  "/products/:id",
  is(["ROLE_ADMIN", "ROLE_USER"]),
  productController.show
);

export { router };
