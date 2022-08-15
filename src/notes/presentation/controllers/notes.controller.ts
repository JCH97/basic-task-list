import { Body, Controller, Delete, Logger, Post, Put, Request, Response, UseGuards } from "@nestjs/common";
import { ProcessResponse } from "../../../shared/core/utils/processResponse";
import { NotesPaginatedDto } from "../../application/dtos/notes.paginated.dto";
import { NotesUpdateDto } from "../../application/dtos/notes.update.dto";
import { NotesCreateDto } from "../../application/dtos/notes.create.dto";
import {
  CreateNotesUseCase,
  PaginatedNotesUseCase,
  RemoveNotesUseCase,
  UpdateNotesUseCase
} from "../../application/use-cases";
import { Notes } from "../../domain/entities/notes.entities";
import { NotesMapper } from "../../infra/mapper/notes.mapper";
import { LocalAuthGuard } from "../../../auth/application/guards/local.auth.guard";

@Controller("notes")
export class NotesController {

  private _logger: Logger;

  constructor(
    private readonly createNotes: CreateNotesUseCase,
    private readonly updateNotes: UpdateNotesUseCase,
    private readonly removeNotes: RemoveNotesUseCase,
    private readonly paginatedNotes: PaginatedNotesUseCase) {

    this._logger = new Logger("NotesController");
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async getAllPaginated(@Body() body: NotesPaginatedDto, @Request() req, @Response() res) {
    this._logger.log("Paginated");

    const pag = await this.paginatedNotes.execute(body, req.user.id);
    return ProcessResponse.setResponse(res, pag, NotesMapper.PaginatedToDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("create")
  async create(@Body() body: NotesCreateDto, @Request() req, @Response() res) {

    this._logger.log("Create");
    const note = await this.createNotes.execute(body, req.user.id);
    return ProcessResponse.setResponse<Notes>(res, note, NotesMapper.DomainToDto);
  }

  @UseGuards(LocalAuthGuard)
  @Put()
  async update(@Body() body: NotesUpdateDto, @Request() req, @Response() res) {
    this._logger.log("Update");

    const note = await this.updateNotes.execute(body, req.user.id);
    return ProcessResponse.setResponse<Notes>(res, note, NotesMapper.DomainToDto);
  }

  @UseGuards(LocalAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Request() req, @Response() res) {
    this._logger.log("Delete");

    const note = await this.removeNotes.execute(body, req.user.id);
    return ProcessResponse.setResponse<Notes>(res, note, NotesMapper.DomainToDto);
  }
}