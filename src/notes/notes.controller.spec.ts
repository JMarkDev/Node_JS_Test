import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getModelToken } from '@nestjs/mongoose';
import { Note } from './schemas/note.schema';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  const mockRequest = {
    user: {
      userId: 'user-id-123',
      email: 'test@example.com',
    },
  };

  const mockNote = {
    _id: 'note-id-123',
    title: 'Test Note',
    content: 'Test Content',
    owner: 'user-id-123',
    tags: ['test'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotesService = {
    create: jest.fn().mockResolvedValue(mockNote),
    findAll: jest.fn().mockResolvedValue({
      notes: [mockNote],
      total: 1,
      pages: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockNote),
    update: jest.fn().mockResolvedValue({
      ...mockNote,
      title: 'Updated Title',
    }),
    remove: jest.fn().mockResolvedValue(mockNote),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
        {
          provide: getModelToken(Note.name),
          useValue: {}, // Mock the model
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the guard
      .compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test'],
      };

      expect(await controller.create(createNoteDto, mockRequest)).toBe(mockNote);
      expect(service.create).toHaveBeenCalledWith(createNoteDto, mockRequest.user.userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = await controller.findAll(mockRequest, { page: 1, limit: 10 });
      expect(result.notes).toEqual([mockNote]);
      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user.userId, {
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single note', async () => {
      expect(await controller.findOne('note-id-123', mockRequest)).toBe(mockNote);
      expect(service.findOne).toHaveBeenCalledWith('note-id-123', mockRequest.user.userId);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Title',
      };

      const result = await controller.update('note-id-123', updateNoteDto, mockRequest);
      expect(result.title).toBe('Updated Title');
      expect(service.update).toHaveBeenCalledWith('note-id-123', updateNoteDto, mockRequest.user.userId);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      expect(await controller.remove('note-id-123', mockRequest)).toBe(mockNote);
      expect(service.remove).toHaveBeenCalledWith('note-id-123', mockRequest.user.userId);
    });
  });
});
