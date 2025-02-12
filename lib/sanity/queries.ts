import { groq } from 'next-sanity'

// Navigation
export const navigationQuery = groq`
*[_type == "navigation"][0] {
  items[] {
    text,
    link,
    dropdown[] {
      text,
      link,
      description,
      icon
    }
  }
}`

// Footer
export const footerQuery = groq`
*[_type == "footer"][0] {
  logo,
  description,
  columns[] {
    title,
    links[] {
      text,
      url
    }
  },
  social,
  contact,
  legal[] {
    text,
    url
  }
}`

// Homepage
export const homepageQuery = groq`
*[_type == "homepage"][0] {
  hero {
    title,
    subtitle,
    backgroundImage,
    cta
  },
  features {
    title,
    subtitle,
    featuresList[] {
      title,
      description,
      icon
    }
  },
  cta {
    title,
    description,
    buttonText,
    buttonLink,
    backgroundImage
  },
  seo
}`

// Blog Posts
export const allPostsQuery = groq`
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  readTime,
  "author": author->name,
  "categories": categories[]->title
}`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  body,
  publishedAt,
  readTime,
  "author": author->name,
  "categories": categories[]->title
}`

// Categories
export const allCategoriesQuery = groq`
*[_type == "category"] {
  _id,
  title,
  slug,
  description
}`

// Services
export const allServicesQuery = groq`
*[_type == "service"] {
  _id,
  title,
  slug,
  icon,
  shortDescription,
  features[] {
    title,
    description,
    icon
  },
  pricing[] {
    name,
    price,
    interval,
    features
  }
}`

// About Page
export const aboutPageQuery = groq`
*[_type == "about"][0] {
  mission {
    title,
    statement,
    values[] {
      title,
      description,
      icon
    }
  },
  team {
    title,
    subtitle,
    members[] {
      name,
      role,
      bio,
      image,
      social
    }
  },
  history {
    title,
    timeline[] {
      year,
      title,
      description,
      image
    }
  },
  seo
}`