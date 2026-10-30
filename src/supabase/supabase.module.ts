import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service.js';
import { SupabaseController } from './supabase.controller.js';

@Global()
@Module({
  controllers: [SupabaseController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

