import { BaseDto } from "../../../shared/core/BaseDto";

export type NotesDto = BaseDto & {
  text: string;
  userId: { id: string };
}