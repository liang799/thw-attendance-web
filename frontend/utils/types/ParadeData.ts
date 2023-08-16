import { Attendance } from "@/utils/types/AttendanceData";

export type ParadeData = {
  id: number,
  type: string,
  startDate: string,
  endDate?: string,
  attendances: Attendance[]
}