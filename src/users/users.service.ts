import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { hash } from 'src/utils/hash';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const alreadyExists = await this.prisma.user.findUnique({
      where: { user: data.user },
    });
    if (alreadyExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    return this.prisma.user.create({
      data: {
        ...data,
        password: await hash(data.password),
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    data.password = undefined; // para nao permitir atualizar a senha indevidamente

    const foundUser = await this.prisma.user.findUnique({
      where,
    });

    if (!foundUser)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where,
    });

    if (!foundUser)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    return this.prisma.user.delete({
      where,
    });
  }
}
