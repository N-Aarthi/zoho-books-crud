import { Module } from '@nestjs/common';
import { ZohoBooksController } from './zoho/zoho.controller'; // Adjust the import path as needed

@Module({
  imports: [],
  controllers: [ZohoBooksController],
  providers: [],
})
export class AppModule {}
