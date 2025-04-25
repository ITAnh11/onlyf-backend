import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    Column,
  } from 'typeorm';
  import { User } from './user.entity';
import { Post } from './post.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    senderId: number;

    @Column()
    receiverId: number;

    @Column({ nullable: true })
    postId?: number; // ID bài viết nếu tin nhắn là một bài viết

    @Column({ nullable: true })
    text?: string; // Nội dung tin nhắn văn bản
  
    @Column({ nullable: true })
    mediaUrl?: string; // URL file ảnh, video, audio...
  
    @Column({
      type: 'enum',
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    })
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
  
    @Column({
      type: 'enum',
      enum: ['sent', 'read'],
      default: 'sent',
    })
    status: 'sent' | 'read';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Post, (post) => post.replys)
    @JoinColumn({ name: 'postId' })
    post?: Post; // Bài viết nếu tin nhắn là một bài viết

    @ManyToOne(() => User, (user) => user.sentMessages)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;
  }