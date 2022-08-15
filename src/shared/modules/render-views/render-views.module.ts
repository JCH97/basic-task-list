import { Module } from "@nestjs/common";
import { RenderViewsController } from "./render-views.controller";

@Module({
  controllers: [RenderViewsController]
})
export class RenderViewsModule {
}