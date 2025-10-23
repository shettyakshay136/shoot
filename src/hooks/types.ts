export interface UseHomeReturn {
  data: any;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface UsePerformanceReturn {
  performanceData: any;
  loading: boolean;
  error: string | null;
}
