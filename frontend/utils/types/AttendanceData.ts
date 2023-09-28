import { UserData } from "@/utils/types/UserData";

export type CreateAttendanceData = {
  availability: string,
  status: string,
  absentStartDate?: Date,
  absentEndDate?: Date,
  user: number,
  location?: string,
  id?: number,
}

export type GetAttendanceData = {
  type: string,
  status: string,
  absentStartDate?: string,
  absentEndDate?: string,
  user: number,
  dispatchLocation?: string,
  location?: string,
}

export type Attendance = {
  id: number,
  user: UserData,
  availability: GetAttendanceData,
  parade: number,
  submittedAt: Date
}
