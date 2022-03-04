import { CheckListItem } from './checklist-item';

export interface Checklist {
  id: string;
  title: string;
  items: CheckListItem[];
}
