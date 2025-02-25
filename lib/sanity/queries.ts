import { groq } from 'next-sanity'

// Navigation query
export const navigationQuery = groq`*[_type == "navigation"][0] {
  title,
  logo {
    text,
    showText,
    image,
    showImage,
    imageHeight,
    imageWidth,
    logoHeight,
    logoWidth,
    showIcon
  },
  menuItems[] {
    text,
    href,
    show,
    isButton,
    buttonVariant,
    submenu[] {
      text,
      href,
      show,
      description
    }
  },
  mobileSettings {
    breakpoint,
    showSocialLinks
  },
  socialLinks[] {
    platform,
    url,
    show
  }
}`

// Footer query
export const footerQuery = groq`*[_type == "footer" && defined(companyInfo)][0] {
  companyInfo {
    name,
    "logo": logo.asset->url,
    logoWidth,
    showLogo,
    showName,
    address,
    phone,
    email,
    showAddress,
    showPhone,
    showEmail
  },
  socialLinks[] {
    platform,
    url,
    show
  },
  copyright,
  showCopyright
}`

// Form query
export const formQuery = groq`*[_type == "form" && status == "published" && slug.current == $slug][0] {
  _id,
  _type,
  name,
  "slug": slug.current,
  title,
  description,
  fields[] {
    group,
    fields[] {
      _key,
      label,
      type,
      name,
      required,
      hidden,
      showWhen {
        field,
        equals
      },
      options[] {
        _key,
        value
      },
      placeholder,
      validation {
        min,
        max,
        pattern,
        message
      },
      unit
    }
  },
  complianceFields[] {
    _key,
    text,
    type,
    required
  },
  submitButton {
    text,
    loadingText
  },
  successMessage {
    title,
    message
  },
  errorMessage {
    title,
    message
  },
  notifications {
    adminEmail,
    emailTemplate {
      subject,
      sections[] {
        _key,
        title,
        fields[] {
          _key,
          label,
          value
        }
      },
      footer
    }
  },
  "_updatedAt": _updatedAt
}`

// Terms & Privacy queries
export const termsQuery = groq`*[_type == "terms"][0] {
  title,
  lastUpdated,
  introduction,
  content[] {
    sectionTitle,
    content,
    subsections[] {
      title,
      content
    }
  },
  serviceTerms[] {
    title,
    description,
    conditions
  },
  liabilityLimitations[] {
    title,
    description
  },
  disputeResolution {
    process,
    jurisdiction,
    arbitration
  },
  terminationClauses[] {
    title,
    conditions,
    consequences
  },
  contactInformation {
    email,
    phone,
    address
  },
  effectiveDate,
  seo
}`

export const policyQuery = groq`*[_type == "policy"][0] {
  title,
  lastUpdated,
  introduction,
  content[] {
    sectionTitle,
    content,
    subsections[] {
      title,
      content
    }
  },
  contactInformation {
    email,
    phone,
    address
  },
  effectiveDate,
  seo
}`

// Homepage query
export const homepageQuery = groq`*[_type == "homepage"][0] {
  hero,
  industryFocus,
  features,
  howItWorks,
  testimonials,
  mapSection,
  faq,
  newsSection,
  cta,
  sectionSettings,
  seo
}`

// Services queries
export const servicesListQuery = groq`*[_type == "service" && status == "published" && defined(title) && defined(slug.current) && visibility.showInLists == true] | order(visibility.featured desc) {
  title,
  "slug": slug.current,
  description,
  icon,
  visibility,
  features[] {
    title,
    description,
    details
  },
  benefits[] {
    title,
    description,
    icon
  }
}`

export const serviceBySlugQuery = groq`*[_type == "service" && status == "published" && slug.current == $slug][0] {
  title,
  description,
  icon,
  features,
  benefits,
  requirements,
  coverage,
  pricing,
  faqs,
  callToAction,
  seo
}`

// About page query
export const aboutQuery = groq`*[_type == "about" && status == "published"][0] {
  title,
  mission,
  history,
  values,
  team,
  stats,
  certifications,
  callToAction,
  seo
}`

// Blog queries
export const blogListQuery = groq`{
  "posts": *[_type == "post" && status == "published" && defined(title) && defined(slug.current) && visibility.showInLists == true] | order(publishedAt desc) [$start...$end] {
    title,
    slug,
    excerpt,
    featuredImage,
    author->,
    categories[]->,
    publishedAt,
    readTime,
    visibility
  },
  "total": count(*[_type == "post" && status == "published" && visibility.showInLists == true])
}`

export const postBySlugQuery = groq`*[_type == "post" && status == "published" && slug.current == $slug][0] {
  title,
  body,
  featuredImage,
  author->,
  categories[]->,
  publishedAt,
  readTime,
  relatedPosts[]->,
  callToAction,
  seo
}`

// Existing chat queries...

export const chatSettingsQuery = groq`*[_type == "chatSettings"][0] {
  title,
  systemPrompt,
  maxFreeMessages,
  styling {
    primaryColor,
    bubbleSize,
    position
  },
  leadForm {
    companyFieldRequired,
    nameLabel,
    emailLabel,
    companyLabel
  },
  messages {
    welcomeMessage,
    leadFormIntro,
    maxMessagesReached
  }
}`

export const chatLeadQuery = groq`*[_type == "chatLead" && email == $email][0] {
  _id,
  name,
  email,
  company,
  conversations
}`
