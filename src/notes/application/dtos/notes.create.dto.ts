import { NotesDto } from "./notes.dto";

export type NotesCreateDto = Omit<NotesDto, "id" | "createdAt" | "updatedAt">;