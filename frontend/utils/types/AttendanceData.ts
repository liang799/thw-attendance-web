import { UserData } from "@/utils/types/UserData";

export type AttendanceData = {
  availability: string,
  status: string,
  mcStartDate?: Date,
  mcEndDate?: Date,
  user: number,
  location?: string,
}

export type Attendance = {
  id: number,
  user: UserData,
  availability: AttendanceData,
  parade: number,
  submittedAt: Date
}