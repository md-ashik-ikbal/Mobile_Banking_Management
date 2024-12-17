import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <body style="margin: 0; background-color: #111827; color: #cbd5e1">
        <div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
          <h1 style="margin: 0;">The Application Is Working</h1>
        </div>
      </body>
    `;
  }
}
