import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.notificationService.getAllNotifications(userId);
  }
}