import { Body, Controller, Post, Request, Response, UseGuards } from "@nestjs/common";
import { ProcessResponse } from "src/shared/core/utils/processResponse";
import { RegisterDto } from "../application/dtos/register.dto";
import { LocalAuthGuard } from "../application/guards/local.auth.guard";
import { RegisterUseCase } from "../application/useCase/auth.register.use-case";
import { Response as Res } from "express";
import { LoginUserUseCase } from "../application/useCase";
import { ValidateDto } from "../application/dtos/validate.dto";
import { UserMapper } from "../../user/infra/mappers/user.mappers";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authRegister: RegisterUseCase,
    private readonly loginUser: LoginUserUseCase) {
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() body: ValidateDto, @Request() req, @Response() res: Res) {
    const login = await this.loginUser.execute(body);
    return ProcessResponse.setResponse(res, login, UserMapper.DomainToDto);
  }

  @Post("register")
  async Register(@Body() userDto: RegisterDto, @Response() res) {
    const user = await this.authRegister.execute(userDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }
}