import { ColorLevel } from '../../core/constant/logger/color.const';
import * as clc from 'cli-color';

export function generateColor(level: string) {
  switch (level) {
    case 'info':
      return ColorLevel['info'];
    case 'warn':
      return ColorLevel['warn'];
    case 'error':
      return ColorLevel['error'];
    case 'debug':
      return ColorLevel['debug'];
    case 'verbose':
      return ColorLevel['verbose'];
    default:
      return 0;
  }
}



export function generateTagLevel(level: string, color: number) {
  return clc.xterm(color).white.bold(` ${level.toUpperCase()} `);
}
