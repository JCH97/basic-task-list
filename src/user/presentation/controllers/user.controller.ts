import { Body, Controller, Logger, Post, Put, Request, Response, UseGuards } from "@nestjs/common";
import { ProcessResponse } from "src/shared/core/utils/processResponse";
import { UserCreateDto } from "../../application/dtos/user.create.dto";
import { UserUpdateDto } from "../../application/dtos/user.update.dto";
import { CreateUserUseCase } from "../../application/useCases/user.create.use-case";
import { UpdateUserUseCase } from "../../application/useCases/user.update.use-case";
import { UserMapper } from "../../infra/mappers/user.mappers";
import { PaginatedUserUseCase } from "../../application/useCases/user.paginate.use-case";
import { LocalAuthGuard } from "../../../auth/application/guards/local.auth.guard";

@Controller("user")
export class UserController {

  private readonly _logger: Logger;

  constructor(private readonly createUser: CreateUserUseCase, private readonly updateUser: UpdateUserUseCase, private readonly paginateUser: PaginatedUserUseCase) {
    this._logger = new Logger("UserController");
  }

  @Post("create")
  async create(@Body() userCreateDto: UserCreateDto, @Request() req, @Response() res) {
    this._logger.log("Created");

    const user = await this.createUser.execute(userCreateDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }

  @UseGuards(LocalAuthGuard)
  @Put()
  async update(@Body() updateUserDto: UserUpdateDto, @Request() req, @Response() res) {
    this._logger.log("Updated");

    const user = await this.updateUser.execute(updateUserDto, req.user.id);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }

  // @Post()
  // async getAllPaginated(@Body() body: UserPaginatedDto, @Response() res) {
  //   this._logger.log("Paginated");
  //
  //   const pag = await this.paginateUser.execute(body);
  //   return ProcessResponse.setResponse(res, pag, UserMapper.PaginatedToDto);
  // }
}