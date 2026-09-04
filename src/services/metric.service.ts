import { dataset } from "./dataset";
import type { HealthSnapshot } from "@/data/demo/analytics";

export interface MetricService {
  health(): HealthSnapshot;
}

export const metricService: MetricService = {
  health() {
    return dataset.health;
  },
};
