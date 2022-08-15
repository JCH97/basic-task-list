import { forwardRef, Module } from "@nestjs/common";
import { DataAccessModule } from "../shared/modules/data-access/data-access.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotesPersistence } from "./infra/entities/notes.persistence";
import { NotesUseCases } from "./application/use-cases";
import { NotesRepository } from "./infra/repositories/notes.repository";
import { NotesController } from "./presentation/controllers/notes.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([NotesPersistence]),
    forwardRef(() => AuthModule)
  ],
  providers: [...NotesUseCases, NotesRepository],
  controllers: [NotesController],
  exports: []
})
export class NotesModule {
}