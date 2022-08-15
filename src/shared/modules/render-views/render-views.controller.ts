import { Controller, Get, Res } from "@nestjs/common";

@Controller()
export class RenderViewsController {
  @Get()
  async indexView(@Res() response) {
    response.render("index");
  }
}