import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private server: Server;
  private logger = new Logger('ChatGateway');
  private userSocketMap = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    client.join(userId);
    this.userSocketMap.set(client.id, userId);
    await this.chatService.updateUserOnlineStatus(userId, true);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.userSocketMap.get(client.id)!;
    this.userSocketMap.delete(client.id);
    await this.chatService.updateUserOnlineStatus(userId, false);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() payload: SendMessageDto) {
    const message = await this.chatService.createMessage(payload);
    const isGroup = Array.isArray(payload.groupParticipantIds) && payload.groupParticipantIds.length > 2;
    if (isGroup) {
      this.server.to(message.conversationId!).emit('receiveMessage', message);
    } else {
      this.server.to(payload.senderId).emit('receiveMessage', message);
      this.server.to(payload.receiverId).emit('receiveMessage', message);
    }
    return { success: true, message };
  }

  @SubscribeMessage('updateMessageStatus')
  async handleUpdateMessageStatus(@MessageBody() payload: UpdateMessageStatusDto) {
    const updated = await this.chatService.updateMessageStatus(payload);
    this.server.to(updated.senderId).emit('messageStatusUpdated', {
      messageId: updated.messageId,
      status: payload.status,
    });
    return { success: true };
  }
}
