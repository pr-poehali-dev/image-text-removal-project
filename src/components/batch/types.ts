export interface BatchImage {
  file: File;
  preview: string;
  maskDataUrl?: string;
  processing?: boolean;
  processed?: string;
  error?: string;
}
