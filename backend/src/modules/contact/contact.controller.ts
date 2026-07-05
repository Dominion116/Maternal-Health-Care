import { Request, Response, NextFunction } from 'express';
import * as contactService from './contact.service';
import { sendSuccess } from '../../utils/response';

export async function submitContactForm(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contactService.submitContactForm(req.body);
    return sendSuccess(res, data, 'Message received — we will get back to you shortly', 201);
  } catch (err) {
    return next(err);
  }
}
