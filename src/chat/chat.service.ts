import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { ConversationType } from '@prisma/client';

@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');

  constructor(private readonly prisma: PrismaService) {}

  async createConversation(participantIds: string[]) {
    if (participantIds.length < 3) {
      throw new BadRequestException('Group must have at least 3 participants');
    }
    const conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        participants: { create: participantIds.map((userId) => ({ userId })) },
      },
      include: { participants: true },
    });
    return {
      conversationId: conversation.id,
      participants: conversation.participants.map((p) => p.userId),
    };
  }

  async getOrCreateGroupConversation(userIds: string[]) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.GROUP,
        AND: userIds.map((id) => ({ participants: { some: { userId: id } } })),
      },
      include: { participants: true },
    });
    if (conv) return conv;
    return this.prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        participants: { create: userIds.map((userId) => ({ userId })) },
      },
      include: { participants: true },
    });
  }

  async createMessage(data: SendMessageDto) {
    let conversationId: string | null = null;
    if (Array.isArray(data.groupParticipantIds) && data.groupParticipantIds.length > 2) {
      const conv = await this.getOrCreateGroupConversation(data.groupParticipantIds);
      conversationId = conv.id;
    }
    const message = await this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        messageType: data.messageType,
        conversationId: conversationId ?? undefined,
      },
      include: {
        sender: { select: { userId: true, name: true } },
        receiver: { select: { userId: true, name: true } },
      },
    });
    return message;
  }

  async getMessagesBetweenConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { userId: true, name: true } },
        receiver: { select: { userId: true, name: true } },
      },
    });
  }

  async getMessagesBetweenUsers(senderId: string, receiverId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId: null,
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { userId: true, name: true } },
        receiver: { select: { userId: true, name: true } },
      },
    });
  }

  async updateMessageStatus(data: UpdateMessageStatusDto) {
    const updateData: any = {};
    if (data.status === 'seen') {
      updateData.seen = true;
      updateData.delivered = true;
    } else {
      updateData.delivered = true;
    }
    return this.prisma.message.update({
      where: { messageId: data.messageId },
      data: updateData,
      include: {
        sender: { select: { userId: true, name: true } },
        receiver: { select: { userId: true, name: true } },
      },
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true, isOnline: true },
    });
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean) {
    return this.prisma.user.update({
      where: { userId },
      data: { isOnline },
    });
  }
}
