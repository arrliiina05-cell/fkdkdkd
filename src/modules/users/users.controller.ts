import { Context, Hono, type TypedResponse } from "hono";
import { UsersRepository } from "./users.repository";
import {
  IDParamSchema,
  type ApplicationEnvironment,
  type ApplicationResult,
  type IDParamType,
} from "../applicatoin.types";
import type { ApplicationResult } from "../application.types";
import type {UserType} from './users.types';

export class UsersController {
  constructor(private readonly repository: UsersRepository) {}

  public routes(): Hono {
    return new Hono()
      .get('/', this.findAll.bind(this))
      .get(
        "/:id", 
        ApplicationValidator.validate("param", IDParamSchema),
        this.findById.bind(this),
      );
  }

  public async findAll(
    c: Context,
  ): Promise<TypedResponse<ApplicationResult<UserType[]>>> {
    return c.json({
      success: true,
      data: this.repository.findAll(),
    })
  }

  public async findById(
    c: Context<ApplicationEnvironment, "/:id", { out: {param: IDParamType } }>,
  ): Promise<TypedResponse<ApplicationResult<UserType>>> {
    const { id } = c.req.valid("param");
    const user = this.repositopy.findById(id);

    if (!user) {
      return c.json({ succes: false, error: "Used not found" });
    }

    return c.json ({succes: true, data: user});
  }
}