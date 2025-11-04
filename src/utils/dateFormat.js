import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date) {
  const parsed = parseISO(date); // converte "2025-11-04" para Date
  return format(parsed, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
