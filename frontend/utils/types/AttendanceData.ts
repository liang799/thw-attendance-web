import { UserData } from "@/utils/types/UserData";

export type CreateAttendanceData = {
  availability: string,
  status: string,
  mcStartDate?: Date,
  mcEndDate?: Date,
  user: number,
  location?: string,
}

export type GetAttendanceData = {
  type: string,
  status: string,
  mcStartDate?: string,
  mcEndDate?: string,
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