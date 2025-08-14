import { useState, useCallback } from 'react';
import { StatusType } from '@/components/dashboard/StatusMenu';

export interface StatusState {
  current: StatusType;
  startTime: number | null;
  config: any;
}

export const useStatus = (initialStatus: StatusType = 'active') => {
  const [statusState, setStatusState] = useState<StatusState>({
    current: initialStatus,
    startTime: null,
    config: null
  });

  const setStatus = useCallback((
    status: StatusType, 
    config?: any, 
    startTime?: number
  ) => {
    setStatusState({
      current: status,
      startTime: startTime || (status !== 'active' ? Date.now() : null),
      config: config || null
    });
  }, []);

  const resetStatus = useCallback(() => {
    setStatusState({
      current: 'active',
      startTime: null,
      config: null
    });
  }, []);

  const updateConfig = useCallback((config: any) => {
    setStatusState(prev => ({
      ...prev,
      config
    }));
  }, []);

  return {
    status: statusState.current,
    startTime: statusState.startTime,
    config: statusState.config,
    setStatus,
    resetStatus,
    updateConfig
  };
};