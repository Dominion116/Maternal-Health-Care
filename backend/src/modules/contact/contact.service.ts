import { supabaseAdmin } from '../../config/supabase';
import { ContactDtoType } from './contact.dto';

export async function submitContactForm(dto: ContactDtoType) {
  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .insert({
      name: dto.name,
      email: dto.email,
      subject: dto.subject ?? null,
      message: dto.message,
    })
    .select('id, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data;
}
