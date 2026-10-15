import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import type { Attendance, CreateAttendanceData, GetAttendanceData } from '@/utils/types/AttendanceData';
import type { ParadeData } from '@/utils/types/ParadeData';
import { attendanceOptions } from '@/config/attendanceOptions';
import { GUEST_BRANCHES, readGuestData, saveGuestData, type GuestData } from './session';

function paradeDetails(data: GuestData, id: number): ParadeData | undefined {
  const parade = data.parades.find(item => item.id === id);
  if (!parade) return undefined;
  const attendances = data.attendances.filter(item => item.parade === id)
    .sort((a, b) => GUEST_BRANCHES.indexOf(a.user.type) - GUEST_BRANCHES.indexOf(b.user.type));
  const statuses = Array.from(new Set(attendances.map(item => item.availability.status)));
  return {
    ...parade, type: 'Demo', attendances,
    summary: statuses.map(status => ({ status, count: attendances.filter(item => item.availability.status === status).length })),
    strength: GUEST_BRANCHES.map(type => ({
      type,
      total: attendances.filter(item => item.user.type === type).length,
      present: attendances.filter(item => item.user.type === type && item.availability.type === 'Present').length,
    })),
  };
}

function response(config: InternalAxiosRequestConfig, data: unknown, status = 200) {
  return { data, status, statusText: String(status), headers: {}, config };
}

/** All requests in guest mode terminate here, including unsupported routes. */
export const guestAdapter: AxiosAdapter = async config => {
  const fail = (message: string, status = 400): never => {
    throw new AxiosError(message, 'ERR_GUEST_REQUEST', config, undefined, response(config, { message }, status));
  };
  const data = readGuestData();
  const method = config.method?.toLowerCase();
  const path = (config.url || '').split('?')[0].replace(/\/$/, '');
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const ongoing = data.parades.find(parade => !parade.endDate);
  const userMatch = path.match(/^\/users\/(\d+)$/);
  const paradeMatch = path.match(/^\/parades\/(\d+)$/);
  const attendanceMatch = path.match(/^\/attendances\/(\d+)$/);
  const selfMatch = path.match(/^\/ongoing-parade\/users\/(\d+)\/attendance$/);

  const availability = (dto: CreateAttendanceData): GetAttendanceData => {
    if (!attendanceOptions.some(option => option.availability === dto.availability && option.status === dto.status)) {
      return fail('Choose a valid attendance status.');
    }
    return {
      type: ['Expect Arrival', 'Dispatch', 'WFH'].includes(dto.availability) ? 'Present' : 'Absent',
      status: dto.status,
      user: dto.user,
      ...(dto.availability === 'Dispatch' ? { dispatchLocation: dto.location || '' } : {}),
      ...(dto.availability === 'Absent' ? {
        absentStartDate: dto.absentStartDate ? new Date(dto.absentStartDate).toISOString() : undefined,
        absentEndDate: dto.absentEndDate ? new Date(dto.absentEndDate).toISOString() : undefined,
      } : {}),
    };
  };
  const save = (result: unknown) => {
    saveGuestData(data);
    return response(config, result);
  };
  const updateAttendance = (id: number, dto: CreateAttendanceData) => {
    const attendance = data.attendances.find(item => item.id === id);
    if (!attendance) return fail('Demo attendance was not found.', 404);
    attendance.availability = availability({ ...dto, user: attendance.user.id });
    attendance.submittedAt = new Date();
    return attendance;
  };

  if (method === 'get') {
    if (path === '/ongoing-parade') return response(config, ongoing ? paradeDetails(data, ongoing.id) : null);
    if (path === '/parades') return response(config, data.parades);
    if (path === '/users') return response(config, data.users);
    if (selfMatch) return response(config, data.attendances.find(item => item.parade === ongoing?.id && item.user.id === +selfMatch[1]) || null);
    if (paradeMatch) return response(config, paradeDetails(data, +paradeMatch[1]) || fail('Demo parade was not found.', 404));
    if (userMatch) return response(config, data.users.find(user => user.id === +userMatch[1]) || fail('Demo user was not found.', 404));
  }

  if (method === 'post' && path === '/attendances') {
    if (!ongoing) return fail('Start a new demo parade before submitting attendance.', 409);
    const user = data.users.find(user => user.id === body.user);
    if (!user) return fail('Demo user was not found.', 404);
    const existing = data.attendances.find(item => item.parade === ongoing.id && item.user.id === user.id);
    if (existing) return save(updateAttendance(existing.id, body));
    const attendance: Attendance = {
      id: data.nextId++, user, parade: ongoing.id, submittedAt: new Date(), availability: availability(body),
    };
    data.attendances.push(attendance);
    return save(attendance);
  }
  if (method === 'put' && attendanceMatch) return save(updateAttendance(+attendanceMatch[1], body));
  if (method === 'put' && path === '/attendances' && Array.isArray(body)) {
    return save(body.map(dto => updateAttendance(dto.id, dto)));
  }
  if (method === 'delete' && attendanceMatch) {
    data.attendances = data.attendances.filter(item => item.id !== +attendanceMatch[1]);
    return save(null);
  }
  if (method === 'patch' && paradeMatch) {
    const parade = data.parades.find(item => item.id === +paradeMatch[1]);
    if (!parade) return fail('Demo parade was not found.', 404);
    parade.endDate = new Date(body.endDate).toISOString();
    return save(parade);
  }
  if (method === 'post' && path === '/parades') {
    if (ongoing) return fail('Stop the current demo parade before creating another.', 409);
    const parade = { id: data.nextId++, startDate: new Date(body.startDate).toISOString() };
    const previousId = data.parades[0]?.id;
    const templates = data.users.filter(user => !user.hasLeftNode).map((user): Attendance => {
      const previous = data.attendances.find(item => item.parade === previousId && item.user.id === user.id);
      const absence = previous?.availability;
      const carryAbsence = absence?.absentEndDate && new Date(absence.absentEndDate) >= new Date(parade.startDate);
      return {
        id: data.nextId++, user, parade: parade.id, submittedAt: new Date(),
        availability: carryAbsence ? { ...absence } : { type: 'Absent', status: '', user: user.id },
      };
    });
    data.parades.unshift(parade);
    data.attendances.push(...templates);
    return save(parade);
  }
  if (method === 'post' && path === '/users') {
    if (!body.name?.trim() || !body.rank?.trim() || !GUEST_BRANCHES.includes(body.type)) return fail('Complete the demo user details.');
    const user = { id: data.nextId++, name: body.name, rank: body.rank, type: body.type, hasLeftNode: false };
    data.users.push(user);
    if (ongoing) data.attendances.push({
      id: data.nextId++, user, parade: ongoing.id, submittedAt: new Date(),
      availability: { type: 'Absent', status: '', user: user.id },
    });
    return save(user);
  }
  if (method === 'patch' && userMatch) {
    const user = data.users.find(item => item.id === +userMatch[1]);
    if (!user) return fail('Demo user was not found.', 404);
    Object.assign(user, { name: body.name, rank: body.rank, type: body.type, hasLeftNode: body.hasLeftNode });
    data.attendances.filter(item => item.user.id === user.id).forEach(item => { item.user = user; });
    return save(user);
  }
  return fail('This action is unavailable in guest mode. Exit the demo to sign in.', 403);
};
