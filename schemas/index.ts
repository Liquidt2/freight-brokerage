import { defineField, defineType } from 'sanity';
import about from './about';
import author from './author';
import blockContent from './blockContent';
import category from './category';
import footer from './footer';
import form, { formField, complianceField } from './form';
import homepage from './homepage';
import media from './media';
import navigation from './navigation';
import policy from './policy';
import post from './post';
import seo from './seo';
import service from './service';
import terms from './terms';
import apiWebhooks from './apiWebhooks';

// Export all schema types
export const schemaTypes = [
  about,
  apiWebhooks,
  author,
  blockContent,
  category,
  footer,
  form,
  formField,
  complianceField,
  homepage,
  media,
  navigation,
  policy,
  post,
  seo,
  service,
  terms
];
