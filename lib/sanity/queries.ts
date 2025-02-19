export const aboutQuery = `*[_type == "about"][0] {
  title,
  mission,
  history[] {
    title,
    description,
    year
  },
  values[] {
    title,
    description,
    icon
  },
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const servicesQuery = `*[_type == "service"] {
  title,
  "slug": slug.current,
  description,
  icon,
  features[] {
    title,
    description,
    details
  },
  benefits[] {
    title,
    description,
    icon
  },
  requirements[] {
    title,
    description,
    items
  },
  coverage {
    areas,
    restrictions
  },
  pricing {
    model,
    description,
    factors
  },
  featured,
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const policyQuery = `*[_type == "policy"][0] {
  title,
  lastUpdated,
  introduction,
  content[] {
    sectionTitle,
    content[] {
      ...,
      _type == "block" => {
        ...,
        markDefs[] {
          ...,
          _type == "internalLink" => {
            "slug": @.reference->slug.current
          }
        }
      }
    },
    subsections[] {
      title,
      content[] {
        ...,
        _type == "block" => {
          ...,
          markDefs[] {
            ...,
            _type == "internalLink" => {
              "slug": @.reference->slug.current
            }
          }
        }
      }
    }
  },
  contactInformation {
    email,
    phone,
    address
  },
  effectiveDate,
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const termsQuery = `*[_type == "terms"][0] {
  title,
  lastUpdated,
  introduction,
  content[] {
    sectionTitle,
    content[] {
      ...,
      _type == "block" => {
        ...,
        markDefs[] {
          ...,
          _type == "internalLink" => {
            "slug": @.reference->slug.current
          }
        }
      }
    },
    subsections[] {
      title,
      content[] {
        ...,
        _type == "block" => {
          ...,
          markDefs[] {
            ...,
            _type == "internalLink" => {
              "slug": @.reference->slug.current
            }
          }
        }
      }
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
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const footerQuery = `*[_type == "footer"][0] {
  companyInfo {
    name,
    showName,
    "logo": logo.asset->url,
    showLogo,
    logoWidth,
    address,
    showAddress,
    phone,
    showPhone,
    email,
    showEmail
  },
  socialLinks[] {
    platform,
    url,
    show
  },
  links[] {
    title,
    url,
    show
  },
  copyright,
  showCopyright,
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const blogPostsQuery = `*[_type == "post"] {
  title,
  "slug": slug.current,
  body,
  "author": author->{
    name,
    "image": image.asset->url
  },
  publishedAt,
  readTime,
  "categories": categories[]->{ title },
  industry,
  mainImage {
    asset->,
    alt
  },
  excerpt,
  featured,
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const singleBlogPostQuery = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  body[] {
    ...,
    _type == "image" => {
      ...,
      "asset": asset->
    }
  },
  "author": author->{
    name,
    "image": image.asset->url
  },
  publishedAt,
  readTime,
  "categories": categories[]->{ title },
  industry,
  mainImage {
    asset->,
    alt
  },
  excerpt,
  featured,
  "seo": seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const homepageQuery = `*[_type == "homepage" && !(_id in path("drafts.**"))][0] {
  _id,
  _type,
  hero {
    title,
    subtitle,
    primaryButton {
      text,
      link
    },
    secondaryButton {
      text,
      link
    }
  },
  industryFocus {
    title,
    subtitle,
    industries[] {
      title,
      description,
      icon
    }
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
  howItWorks {
    title,
    subtitle,
    steps[] {
      title,
      description,
      stepNumber
    }
  },
  blogSection {
    title,
    subtitle,
    showLatestPosts
  },
  testimonials {
    title,
    subtitle,
    testimonialsList[] {
      quote,
      author,
      company
    }
  },
  mapSection {
    title,
    subtitle,
    coverageAreas
  },
  faq {
    title,
    subtitle,
    questions[] {
      question,
      answer
    }
  },
  newsSection {
    title,
    subtitle,
    newsItems[] {
      title,
      content,
      date
    }
  },
  cta {
    title,
    subtitle,
    buttonText,
    buttonLink
  },
  sectionSettings {
    visibleSections[],
    sectionOrder[]
  },
  seo {
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const navigationQuery = `*[_type == "navigation"][0] {
  title,
  logo {
    text,
    showText,
    "image": image.asset->url,
    showImage,
    imageWidth,
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

export const formQuery = `*[_type == "form" && slug.current == $slug][0] {
  _id,
  _type,
  name,
  title,
  description,
  fields[] {
    _key,
    name,
    label,
    type,
    placeholder,
    required,
    options[] {
      _key,
      _type,
      value
    }
  },
  complianceFields[] {
    type,
    text,
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
    emailTemplate
  }
}`

export const coalesce = (value: any, fallback: any) => `coalesce(${value}, ${fallback})`
