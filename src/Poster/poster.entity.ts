import { User } from 'src/User/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Poster {
  @PrimaryGeneratedColumn('uuid')
  postId: string;

  @Column({ default: null })
  postImageLocation: string;

  @Column({ default: null })
  postImageOriginalName: string;

  @Column()
  postName: string;

  @Column()
  caption: string;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne((type) => User, (user) => user.posters)
  createdByUser: User;
}
