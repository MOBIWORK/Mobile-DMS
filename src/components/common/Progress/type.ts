export interface ProgressLinearProps {
    /**
     * Current progress
     */
    progress: number;
    /**
     * Stroke width
     * @default 5
     */
    strokeWidth?: number;
    /**
     * Background color of progress
     * @default #dbdbdb
     */
    bg?: string;
  
    /**
     * Foreground color fo progress
     * @default #C4161C
     */
    fg?: string;
  
    /**
     * Radius of progress
     * @default 4
     */
    radius?: number;
  }
  