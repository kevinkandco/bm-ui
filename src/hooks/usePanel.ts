import { useState, useCallback } from 'react';

export interface PanelState {
  isOpen: boolean;
  content: any;
}

export const usePanel = (initialOpen = false) => {
  const [panelState, setPanelState] = useState<PanelState>({
    isOpen: initialOpen,
    content: null
  });

  const openPanel = useCallback((content?: any) => {
    setPanelState({
      isOpen: true,
      content: content || null
    });
  }, []);

  const closePanel = useCallback(() => {
    setPanelState({
      isOpen: false,
      content: null
    });
  }, []);

  const togglePanel = useCallback((content?: any) => {
    setPanelState(prev => ({
      isOpen: !prev.isOpen,
      content: prev.isOpen ? null : (content || null)
    }));
  }, []);

  return {
    isOpen: panelState.isOpen,
    content: panelState.content,
    openPanel,
    closePanel,
    togglePanel
  };
};