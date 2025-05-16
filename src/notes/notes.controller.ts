import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, PaginationQueryDto } from './dto/note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.notesService.findAll(req.user.userId, paginationQuery);
  }

  @Get(':noteId')
  findOne(@Param('noteId') noteId: string, @Request() req) {
    return this.notesService.findOne(noteId, req.user.userId);
  }

  @Put(':noteId')
  update(@Param('noteId') noteId: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req) {
    return this.notesService.update(noteId, updateNoteDto, req.user.userId);
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('noteId') noteId: string, @Request() req) {
    return this.notesService.remove(noteId, req.user.userId);
  }
}
