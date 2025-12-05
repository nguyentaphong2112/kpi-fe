export class ScrollTabOption {
  icon?: string;
  title: string;
  disabled = false;
  selected = true;
  scrollTo: string;
  children: ScrollTabOption[];
  active: boolean;
}
