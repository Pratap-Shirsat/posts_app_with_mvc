import { Poster } from 'src/Poster/poster.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: null })
  profileImage: string;

  @CreateDateColumn()
  joinedOn: Date;

  @OneToMany((type) => Poster, (poster) => poster.createdByUser)
  posters: Poster[];
}
