import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateMailDto } from './dto/CreateMailDto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(createMailDto: CreateMailDto): Promise<void> {
    const { to, subject, text, html } = createMailDto;

    await this.transporter.sendMail({
      from: `"Buy From Egypt" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

  async sendOtpEmail(to: string, otpCode: string): Promise<void> {
    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otpCode}`;
    const html = `
      <div style="font-family: sans-serif; padding: 10px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP code is:</p>
        <h3 style="color: #0b5ed7;">${otpCode}</h3>
        <p>This code will expire in 3 minutes.</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Buy From Egypt" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
      });
  }
}
