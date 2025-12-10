export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
  description: string;
  variant: 'danger' | 'warning' | 'info';
}

export interface WorkshopModule {
  title: string;
  icon: string;
  description: string;
}