import { Attendance } from "@/utils/types/AttendanceData";

export type ParadeData = {
  id: number,
  type: string,
  startDate: Date,
  endDate?: Date,
  attendances: Attendance[]
}