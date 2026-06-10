import type { TFunction } from 'i18next';

export interface NavItem {
  text: string;
  href: string;
}

export type ExpandableNavItem = NavItem & {
  isExpandable: true;
  submenuItems: NavItem[];
};

export const getNavItems = (t: TFunction<'components', 'navbar'>) => [
  { text: t('aboutUs'), href: '#' },
  {
    text: t('services'),
    href: '#',
    isExpandable: true,
    submenuItems: [
      { text: t('servicesBusiness'), href: '#' },
      { text: t('servicesSeason'), href: '#' },
      { text: t('servicesLeisure'), href: '#' },
    ],
  },
  { text: t('careers'), href: '#' },
  { text: t('news'), href: '#' },
  {
    text: t('agreements'),
    href: '#',
    isExpandable: true,
    submenuItems: [
      { text: t('agreementsServices'), href: '#' },
      { text: t('agreementsUser'), href: '#' },
    ],
  },
];

export const getFooterNavItems = (t: TFunction<'components', 'footer'>) => [
  {
    heading: t('navNav'),
    items: [
      { href: '#', text: t('navNavAbout') },
      { href: '#', text: t('navNavNews') },
      { href: '#', text: t('navNavSupport') },
      { href: '#', text: t('navNavServices') },
    ],
  },
  {
    heading: t('navAbout'),
    items: [
      { href: '#', text: t('navAboutTeam') },
      { href: '#', text: t('navAboutService') },
      { href: '#', text: t('navAboutCareers') },
      { href: '#', text: t('navAboutInvestors') },
    ],
  },
  {
    heading: t('navSupport'),
    items: [
      { href: '#', text: t('navSupportAgreements') },
      { href: '#', text: t('navSupportCommunities') },
      { href: '#', text: t('navSupportContact') },
    ],
  },
];
