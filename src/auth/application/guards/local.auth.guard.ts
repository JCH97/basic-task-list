import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateUserUseCase } from "../useCase";
import { UserMapper } from "../../../user/infra/mappers/user.mappers";

@Injectable()
export class LocalAuthGuard implements CanActivate {

  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      let l = Buffer.from(req.headers.authorization.split(" ")[1], "base64")
        .toString("ascii")
        .split(":");

      let ans = await this.validateUserUseCase.execute({
        email: l[0],
        password: l[1]
      });

      if (ans.isLeft())
        return false;

      req.user = UserMapper.DomainToDto(ans.value.unwrap());

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  // handleRequest(err, user, info, context, status) {
  //   const request = context.switchToHttp().getRequest();
  //   console.log(request.headers);
  //   return null;
  //   const { mobile, password } = request.body;
  //   if (err || !user) {
  //     if (!mobile) {
  //       throw new HttpException({ message: "手机号不能为空" }, HttpStatus.OK);
  //     } else if (!password) {
  //       throw new HttpException({ message: "密码不能为空" }, HttpStatus.OK);
  //     } else {
  //       throw err || new UnauthorizedException();
  //     }
  //   }
  //   return user;
  // }
}