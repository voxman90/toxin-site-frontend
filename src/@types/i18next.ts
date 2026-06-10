import components from '../locales/en/components.json';
import pages from '../locales/en/pages.json';
import uiKit from '../locales/en/ui-kit.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ru';
    resources: {
      pages: typeof pages;
      components: typeof components;
      'ui-kit': typeof uiKit;
    };
  }
}
