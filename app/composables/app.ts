export const useAppMetaConfig = () => {
  const config = useRuntimeConfig();
  
  const baseUrl = config.public.baseUrl;
  const appName = config.public.appName;
  
  return {
    baseUrl,
    appName
  };
};