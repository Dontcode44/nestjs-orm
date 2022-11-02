import { Injectable, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>
  ) {}

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    if (userFound) {
      return new ConflictException('User already exists');
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts', 'profile'],
    });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async deleteUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.delete({ id });
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const toUpdate = Object.assign(userFound, user);
    return this.userRepository.save(toUpdate);
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProfile = this.profileRepository.create(profile);
    const savedProfle = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfle;

    return this.userRepository.save(userFound);
  }
}
