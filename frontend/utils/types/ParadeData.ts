import { Attendance } from "@/utils/types/AttendanceData";

export type ParadeData = {
  id: number,
  type: string,
  startDate: string,
  endDate?: string,
  attendances: Attendance[],
  summary: AvailabilityCount[],
  strength: Strength[]
}

export type AvailabilityCount = {
  status: string,
  count: number,
}
export type Strength = {
  type: string,
  present: number,
  total: number,
}

