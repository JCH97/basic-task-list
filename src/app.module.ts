import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { DataAccessModule } from "./shared/modules/data-access/data-access.module";
import { NotesModule } from "./notes/notes.module";
import { RenderViewsModule } from "./shared/modules/render-views/render-views.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DataAccessModule, UserModule, NotesModule, RenderViewsModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
