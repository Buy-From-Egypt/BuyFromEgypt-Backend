import { Injectable } from '@nestjs/common';
import { SendSmsDto } from './dtos/SendSms.dto';

@Injectable()
export class MobileService {
  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<void> {
    const smsData: SendSmsDto = {
      phoneNumber,
      message: `Your OTP code is: ${otpCode}`,
    };
  }
}
