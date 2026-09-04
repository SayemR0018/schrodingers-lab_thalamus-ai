import type { Report } from "./types";
import { mockReports, getReportById, getReportByQuestion } from "@/data/mock/reports";

export interface ReportService {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | undefined>;
  getReportByQuestion(questionId: string): Promise<Report | undefined>;
}

export const reportService: ReportService = {
  async getReports() {
    return mockReports;
  },

  async getReportById(id: string) {
    return getReportById(id);
  },

  async getReportByQuestion(questionId: string) {
    return getReportByQuestion(questionId);
  },
};
