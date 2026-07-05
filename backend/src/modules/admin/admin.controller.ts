import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import {
  AdminUsersQueryDto,
  AdminConversationsQueryDto,
  AdminPaginationDto,
  UpdateRoleDto,
  InviteAdminDto,
} from './admin.dto';
import { sendSuccess, sendError } from '../../utils/response';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const query = AdminUsersQueryDto.parse(req.query);
    const data = await adminService.listUsers(query);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getUserById(req.params.id);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = UpdateRoleDto.safeParse(req.body);
    if (!dto.success) return sendError(res, dto.error.errors.map((e) => e.message).join(', '), 422);
    const data = await adminService.updateUserRole(req.params.id, dto.data);
    return sendSuccess(res, data, 'Role updated');
  } catch (err) {
    return next(err);
  }
}

export async function inviteAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = InviteAdminDto.safeParse(req.body);
    if (!dto.success) return sendError(res, dto.error.errors.map((e) => e.message).join(', '), 422);
    const data = await adminService.inviteAdmin(dto.data);
    return sendSuccess(res, data, 'Invite sent', 201);
  } catch (err) {
    return next(err);
  }
}

export async function listConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const query = AdminConversationsQueryDto.parse(req.query);
    const data = await adminService.listConversations(query);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getConversationMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getConversationMessages(req.params.id);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getAnalytics(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getAnalytics();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function listSusResponses(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = AdminPaginationDto.parse(req.query);
    const data = await adminService.listSusResponses(page, limit);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function listFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = AdminPaginationDto.parse(req.query);
    const data = await adminService.listFeedback(page, limit);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getModelMetrics(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getModelMetrics();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}
