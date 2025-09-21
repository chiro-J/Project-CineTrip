import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async search(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { bio: Like(`%${query}%`) }
      ],
      select: ['id', 'username', 'email', 'profile_image_url', 'bio', 'createdAt']
    });
  }
}
