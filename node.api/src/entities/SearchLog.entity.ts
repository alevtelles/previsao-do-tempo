import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('search_logs')
export class SearchLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cityFound!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  country!: string | null;

  @Column({ type: 'boolean' })
  success!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  errorMessage!: string | null;

  @Column({ type: 'varchar', length: 45 })
  ipAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
