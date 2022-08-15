import { CreateNotesUseCase } from "./notes.create.use-case";
import { PaginatedNotesUseCase } from "./notes.paginated.use-case";
import { RemoveNotesUseCase } from "./notes.remove.use-case";
import { UpdateNotesUseCase } from "./notes.update.use-case";

export * from "./notes.create.use-case";
export * from "./notes.paginated.use-case";
export * from "./notes.remove.use-case";
export * from "./notes.update.use-case";

export const NotesUseCases = [
  CreateNotesUseCase,
  PaginatedNotesUseCase,
  RemoveNotesUseCase,
  UpdateNotesUseCase
];