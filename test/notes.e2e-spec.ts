import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from '../src/common/filters/global-exeption.filter';
import { getModelToken } from '@nestjs/mongoose';
import { Note } from '../src/notes/schemas/note.schema';
import { User } from '../src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;
  let noteId: string;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    googleId: 'google-id-123',
  };

  const mockNote = {
    _id: 'note-id-123',
    title: 'Test Note',
    content: 'Test Content',
    owner: mockUser._id,
    tags: ['test'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNoteModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(id === mockNote._id ? mockNote : null),
    })),
    findByIdAndUpdate: jest.fn().mockImplementation((id, data) => ({
      exec: jest.fn().mockResolvedValue(id === mockNote._id ? { ...mockNote, ...data } : null),
    })),
    findByIdAndDelete: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(id === mockNote._id ? mockNote : null),
    })),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockNote]),
    countDocuments: jest.fn().mockReturnThis(),
    new: jest.fn().mockImplementation((data) => ({
      ...data,
      _id: 'new-note-id',
      save: jest.fn().mockResolvedValue({ ...data, _id: 'new-note-id' }),
    })),
  };

  const mockUserModel = {
    findById: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue(id === mockUser._id ? mockUser : null),
    })),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getModelToken(Note.name))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();

    // Create a JWT token for test authentication
    token = jwtService.sign({ sub: mockUser._id, email: mockUser.email });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/notes (POST)', () => {
    it('should create a new note', () => {
      return request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Test Note',
          content: 'New Test Content',
          tags: ['test', 'new'],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.title).toBe('New Test Note');
          expect(res.body.content).toBe('New Test Content');
          noteId = res.body._id;
        });
    });

    it('should not create a note with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing required title
          content: 'Test Content',
        })
        .expect(400);
    });
  });

  describe('/api/notes (GET)', () => {
    it('should return all notes for the authenticated user', () => {
      return request(app.getHttpServer())
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('notes');
          expect(Array.isArray(res.body.notes)).toBe(true);
          expect(res.body.notes.length).toBeGreaterThan(0);
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('pages');
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer()).get('/api/notes?page=1&limit=5').set('Authorization', `Bearer ${token}`).expect(200);
    });
  });

  describe('/api/notes/:noteId (GET)', () => {
    it('should return a specific note', () => {
      return request(app.getHttpServer())
        .get(`/api/notes/${mockNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id', mockNote._id);
          expect(res.body).toHaveProperty('title', mockNote.title);
        });
    });

    it('should return 404 for non-existent note', () => {
      return request(app.getHttpServer()).get('/api/notes/non-existent-id').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });

  describe('/api/notes/:noteId (PUT)', () => {
    it('should update a note', () => {
      return request(app.getHttpServer())
        .put(`/api/notes/${mockNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('title', 'Updated Title');
        });
    });
  });

  describe('/api/notes/:noteId (DELETE)', () => {
    it('should delete a note', () => {
      return request(app.getHttpServer()).delete(`/api/notes/${mockNote._id}`).set('Authorization', `Bearer ${token}`).expect(204);
    });
  });
});
