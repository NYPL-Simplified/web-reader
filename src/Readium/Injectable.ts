export interface Injectable {
  type: string;
  url?: string;
  r2after?: boolean;
  r2before?: boolean;
  r2default?: boolean;
  fontFamily?: string;
  systemFont?: boolean;
  appearance?: string;
  async?: boolean;
}
