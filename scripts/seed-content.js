const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

async function uploadImageAsset(client, imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const imageAsset = await client.assets.upload('image', buffer);
    return imageAsset;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Initialize Sanity Client
const client = createClient({
  projectId: 'wfl1kdmd',
  dataset: 'production',
  apiVersion: '2024-03-17',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // ✅ Fixed API token usage
  useCdn: false,
});

async function importContent() {
  try {
    // Read content files
    const contentDir = path.join(__dirname, '..', 'content');
    const homepageContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'homepage.json'), 'utf8'));
    const aboutContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'about.json'), 'utf8'));
    const servicesContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'services.json'), 'utf8'));
    const postsContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'posts.json'), 'utf8'));
    const formsContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'forms.json'), 'utf8'));
    const navigationContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'navigation.json'), 'utf8'));
    const termsContent = JSON.parse(fs.readFileSync(path.join(contentDir, 'terms.json'), 'utf8'));

    // --- Create Forms ---
    console.log('Creating forms...');
    for (const form of formsContent.forms) {
      try {
const existingForm = await client.fetch(
  '*[_type == "form" && slug.current == $slug][0]',
  { slug: form.slug }
);

        if (existingForm) {
          console.log(`Updating form "${form.name}"...`);
          await client.createOrReplace({
            _id: existingForm._id,
            _type: 'form',
            ...form,
            fields: form.fields.map(field => ({
              _type: 'formField', // ✅ Fixed `_type`
              label: field.label,
              name: field.name,
              type: field.type,
              placeholder: field.placeholder || '',
              required: field.required || false,
              options: field.options || [],
              validation: field.validation || null,
            })),
          });
        } else {
          console.log(`Creating form "${form.name}"...`);
          await client.create({
            _type: 'form',
            ...form,
slug: { _type: 'slug', current: form.slug || '' },
            fields: form.fields.map(field => ({
              _type: 'formField',
              label: field.label,
              name: field.name,
              type: field.type,
              placeholder: field.placeholder || '',
              required: field.required || false,
              options: field.options || [],
              validation: field.validation || null,
            })),
          });
        }
      } catch (error) {
        console.error(`Error creating/updating form "${form.name}":`, error);
      }
    }

    // --- Create Navigation ---
    console.log('Creating navigation...');
    try {
      const existingNavigation = await client.fetch('*[_type == "navigation" && _id == "navigationDocId"][0]');

      if (existingNavigation) {
        console.log('Updating navigation...');
        await client.createOrReplace({
          _id: 'navigationDocId',
          _type: 'navigation',
          title: navigationContent.navigation.title,
          menuItems: navigationContent.navigation.menuItems || [],
          socialLinks: navigationContent.navigation.socialLinks || [],
        });
      } else {
        console.log('Creating navigation...');
        await client.create({
          _id: 'navigationDocId',
          _type: 'navigation',
          title: navigationContent.navigation.title,
          menuItems: navigationContent.navigation.menuItems || [],
          socialLinks: navigationContent.navigation.socialLinks || [],
        });
      }
    } catch (error) {
      console.error('Error creating/updating navigation:', error);
    }

    // --- Create Terms ---
    console.log('Creating terms...');
    try {
      const existingTerms = await client.fetch('*[_type == "terms" && _id == "termsDocId"][0]');

      if (existingTerms) {
        console.log('Updating terms...');
        await client.createOrReplace({
          _id: 'termsDocId',
          _type: 'terms',
          ...termsContent.terms,
        });
      } else {
        console.log('Creating terms...');
        await client.create({
          _id: 'termsDocId',
          _type: 'terms',
          ...termsContent.terms,
        });
      }
    } catch (error) {
      console.error('Error creating/updating terms:', error);
    }

    console.log('Content import completed successfully!');
  } catch (error) {
    console.error('Error importing content:', error);
  }
}

// Run the script
importContent();
