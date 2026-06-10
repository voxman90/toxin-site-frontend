import componentsEn from './en/components.json';
import pagesEn from './en/pages.json';
import uiKitEn from './en/ui-kit.json';
import componentsRu from './ru/components.json';
import pagesRu from './ru/pages.json';
import uiKitRu from './ru/ui-kit.json';

export default {
  en: {
    components: componentsEn,
    pages: pagesEn,
    'ui-kit': uiKitEn,
  },
  ru: {
    components: componentsRu,
    pages: pagesRu,
    'ui-kit': uiKitRu,
  },
} as const;
