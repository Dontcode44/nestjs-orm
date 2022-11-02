import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tittle: string;

  @Column()
  content: string;

  @Column()
  authorId: number;
  
  @ManyToOne(() => User, user => user.posts)
  author: User;
}