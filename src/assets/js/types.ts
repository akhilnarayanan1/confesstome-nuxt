interface AlertData{
  message: string,
  type: 'error' | 'success'| 'warning' | string,
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
  type: 'error' | 'success'| 'warning' | string,
  duration?: number,
};

export {
  AlertData,
  ToastData,
};