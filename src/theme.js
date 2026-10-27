import { I18nManager } from 'react-native';

export const colors = {
  bg: '#EBE5D6',
  card: '#F6F2E8',
  cardBorder: '#DAD3BF',
  green: '#5A7660',
  greenSoft: '#DADDCF',
  text: '#2F3E33',
  textSoft: '#5E6E62',
  red: '#E02424',
};


export const ROW = I18nManager.isRTL ? 'row' : 'row-reverse';

//for arabic text
export const arabicText = {
  textAlign: 'right',
  writingDirection: 'rtl',
  color: colors.text,
};
