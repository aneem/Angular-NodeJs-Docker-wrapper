export interface GenericReponse {
  status: string | number;
  message: string;
}
export function responseCreator(message: string, status?: string | number) {
  return { status, message } as GenericReponse;
}
