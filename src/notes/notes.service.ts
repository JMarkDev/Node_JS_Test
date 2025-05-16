import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto, UpdateNoteDto, PaginationQueryDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const newNote = new this.noteModel({
      ...createNoteDto,
      owner: userId,
    });
    return newNote.save();
  }

  async findAll(userId: string, paginationQuery: PaginationQueryDto): Promise<{ notes: Note[]; total: number; pages: number }> {
    const { limit = 10, page = 1 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      this.noteModel.find({ owner: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.noteModel.countDocuments({ owner: userId }).exec(),
    ]);

    return {
      notes,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this note');
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this note');
    }

    return this.noteModel.findByIdAndUpdate(id, updateNoteDto, { new: true }).exec();
  }

  async remove(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this note');
    }

    return this.noteModel.findByIdAndDelete(id).exec();
  }
}
