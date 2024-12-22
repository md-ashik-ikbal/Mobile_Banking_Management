import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer'
import * as nodemailer from 'nodemailer'
import { Email_Template } from './email.template';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private configService: ConfigService) {
    // Initialize transporter
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  // Send Email
  async Send_OTP(to: string, otp: string) {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to,
      subject: "Request For Password Change.",
      html: await Email_Template(otp)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
