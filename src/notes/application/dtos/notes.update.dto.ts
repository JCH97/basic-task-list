import { NotesCreateDto } from "./notes.create.dto";

export type NotesUpdateDto = Partial<NotesCreateDto> & {
  noteId: string;
}