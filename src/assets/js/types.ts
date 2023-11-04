interface AlertData{
  message: string,
  type: 'error' | 'success'| 'warning',
  source: 'ui' | 'server'
  fieldid: string,
};

interface ToastData{
  id?: number,
  message: string,
  run?: {
    feature: () => void,
    message: string,
  },
  type: 'error' | 'success'| 'warning',
  duration?: number,
};

export type {
  AlertData,
  ToastData,
};