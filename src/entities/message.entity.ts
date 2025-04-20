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

    @ManyToOne(() => User, (user) => user.sentMessages)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;
  
    @Column({ nullable: true })
    text?: string; // Nội dung tin nhắn văn bản
  
    @Column({ nullable: true })
    mediaUrl?: string; // URL file ảnh, video, audio...

    @ManyToOne(() => Post, (post) => post.replys)
    @JoinColumn()
    replyToPost?: Post; // Tin nhắn trả lời cho một bài viết
  
    @Column({
      type: 'enum',
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    })
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
  
    @Column({
      type: 'enum',
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    })
    status: 'sent' | 'delivered' | 'read';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }