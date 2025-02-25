import { defineField, defineType } from 'sanity';
import about from './about';
import author from './author';
import chatLead from './chatLead';
import chatSettings from './chatSettings';
import blockContent from './blockContent';
import category from './category';
import footer from './footer';
import form, { formField, complianceField, emailField, emailSection } from './form';
import homepage from './homepage';
import media from './media';
import navigation from './navigation';
import policy from './policy';
import post from './post';
import seo from './seo';
import service from './service';
import terms from './terms';
// Export all schema types
export const schemaTypes = [
  about,
  author,
  chatLead,
  chatSettings,
  blockContent,
  category,
  footer,
  form,
  formField,
  complianceField,
  emailField,
  emailSection,
  homepage,
  media,
  navigation,
  policy,
  post,
  seo,
  service,
  terms
];
