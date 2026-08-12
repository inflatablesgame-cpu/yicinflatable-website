const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

document.querySelectorAll('[data-pagination]').forEach((grid) => {
  const items = Array.from(grid.children).filter((item) =>
    item.matches('.product-tile, .category-tile')
  );
  const pageSize = 12;
  const controls = grid.parentElement.querySelector('[data-pagination-controls]');
  if (!controls || items.length <= pageSize) {
    items.forEach((item) => { item.hidden = false; });
    return;
  }
  const pages = Math.ceil(items.length / pageSize);
  const pageParam = 'page';
  const readPage = () => {
    const value = Number.parseInt(new URLSearchParams(window.location.search).get(pageParam), 10);
    return Number.isFinite(value) ? Math.min(Math.max(value, 1), pages) : 1;
  };
  const writePage = (page, mode = 'push') => {
    const url = new URL(window.location.href);
    if (page === 1) url.searchParams.delete(pageParam);
    else url.searchParams.set(pageParam, String(page));
    window.history[mode + 'State']({ page }, '', url);
  };
  let current = readPage();
  const render = ({ syncUrl = false } = {}) => {
    if (syncUrl) writePage(current);
    items.forEach((item, index) => {
      item.hidden = index < (current - 1) * pageSize || index >= current * pageSize;
    });
    controls.innerHTML = '';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'pagination-arrow';
    previous.textContent = 'Previous';
    previous.disabled = current === 1;
    previous.addEventListener('click', () => { current -= 1; render({ syncUrl: true }); });
    controls.append(previous);
    const pageNumbers = new Set([1, pages, current - 1, current, current + 1]);
    const visiblePages = Array.from(pageNumbers)
      .filter((page) => page >= 1 && page <= pages)
      .sort((a, b) => a - b);
    let lastPage = 0;
    visiblePages.forEach((page) => {
      if (page - lastPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        ellipsis.setAttribute('aria-hidden', 'true');
        controls.append(ellipsis);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = page === current ? 'is-current' : '';
      button.textContent = String(page);
      button.setAttribute('aria-label', `Page ${page}`);
      button.setAttribute('aria-current', page === current ? 'page' : 'false');
      button.addEventListener('click', () => { current = page; render({ syncUrl: true }); });
      controls.append(button);
      lastPage = page;
    });
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'pagination-arrow';
    next.textContent = 'Next';
    next.disabled = current === pages;
    next.addEventListener('click', () => { current += 1; render({ syncUrl: true }); });
    controls.append(next);
  };
  render();
  window.addEventListener('popstate', () => {
    current = readPage();
    render();
  });
});

document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const main = gallery.querySelector('[data-gallery-main]');
  const openLink = gallery.querySelector('[data-gallery-open]');
  const thumbs = Array.from(gallery.querySelectorAll('[data-gallery-thumb]'));
  if (!main || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const source = thumb.dataset.src;
      if (!source) return;
      main.src = source;
      main.alt = thumb.dataset.alt || '';
      if (openLink) openLink.href = source;
      thumbs.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });
      thumb.classList.add('is-active');
      thumb.setAttribute('aria-selected', 'true');
    });
  });
});

if (!document.querySelector('.floating-whatsapp')) {
  const floatingWhatsApp = document.createElement('a');
  floatingWhatsApp.className = 'floating-whatsapp';
  floatingWhatsApp.href = 'https://wa.me/8613580380807';
  floatingWhatsApp.target = '_blank';
  floatingWhatsApp.rel = 'noopener';
  floatingWhatsApp.setAttribute('aria-label', 'Chat with YIC on WhatsApp');
  floatingWhatsApp.title = 'Chat with YIC on WhatsApp';
  floatingWhatsApp.innerHTML = '<svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.1a9.8 9.8 0 0 0-8.5 14.7L2 22l5.4-1.4A9.9 9.9 0 1 0 12 2.1Zm0 17.9a8 8 0 0 1-4.1-1.1l-.3-.2-3.2.8.9-3.1-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.6.8-.1.2-.2.2-.4.1a6.5 6.5 0 0 1-1.7-1.1 6.8 6.8 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.4v-.4c0-.1-.5-1.1-.7-1.5-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.5 2.4 3.7 3.3.5.2.9.3 1.2.4.5.1 1 .1 1.3.1.4-.1 1.2-.5 1.4-.9.2-.4.2-.8.2-.9-.1-.1-.2-.2-.4-.3Z"/></svg><span>Chat with YIC</span>';
  document.body.append(floatingWhatsApp);
}

document.querySelectorAll('.catalog-cta h2 em').forEach((element) => {
  element.style.color = 'var(--ink)';
});

const contactParams = new URLSearchParams(window.location.search);
const productParam = contactParams.get('product');
const countryParam = contactParams.get('country');
const productSelect = document.querySelector('select[name="product"]');
const countryInput = document.querySelector('input[name="country"]');
if (productParam && productSelect) {
  const matchingOption = Array.from(productSelect.options).find((option) => option.value.toLowerCase().includes(productParam.replaceAll('-', ' ')));
  if (matchingOption) productSelect.value = matchingOption.value;
}
if (countryParam && countryInput) {
  countryInput.value = countryParam.replace(/\+/g, ' ');
}

const readableProductName = (slug) => slug
  .split('-')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
const categoryLandingPages = {
  'bounce-house-combos': '/products/bounce-house-combos/',
  'bounce-houses': '/products/bounce-houses/',
  'inflatable-water-slides': '/products/inflatable-water-slides/',
  'obstacle-courses': '/products/obstacle-courses/',
  'theme-parks': '/products/theme-parks/',
  'inflatable-water-parks': '/products/inflatable-water-parks/',
  'inflatable-slides': '/products/inflatable-slides/',
  'sports-games': '/products/sports-games/',
  'mechanical-rides': '/products/mechanical-rides/',
  'inflatable-tents': '/products/inflatable-tents/',
  'advertising-inflatables': '/products/advertising-inflatables/'
};
const categoryDisplayNames = {
  'bounce-house-combos': 'Bounce House Combos',
  'bounce-houses': 'Bounce Houses',
  'inflatable-water-slides': 'Inflatable Water Slides',
  'obstacle-courses': 'Obstacle Courses',
  'theme-parks': 'Theme Parks',
  'inflatable-water-parks': 'Inflatable Water Parks',
  'inflatable-slides': 'Inflatable Slides',
  'sports-games': 'Sports Games',
  'mechanical-rides': 'Mechanical Rides/Games',
  'inflatable-tents': 'Inflatable Tents',
  'advertising-inflatables': 'Advertising Inflatables'
};
const categoryProductSelectLabels = {
  'bounce-house-combos': 'Bounce houses & combos',
  'bounce-houses': 'Bounce houses & combos',
  'inflatable-water-slides': 'Water slides & water parks',
  'inflatable-water-parks': 'Water slides & water parks',
  'inflatable-slides': 'Water slides & water parks',
  'obstacle-courses': 'Obstacle courses',
  'theme-parks': 'Theme parks & custom projects',
  'sports-games': 'Sports games',
  'mechanical-rides': 'Other inflatable products',
  'inflatable-tents': 'Other inflatable products',
  'advertising-inflatables': 'Other inflatable products'
};
const currentProductTitle = document.querySelector('.product-detail-copy h1')?.textContent.trim();
const currentProductPath = window.location.pathname.match(/^\/products\/([^/]+)\/([^/]+)\/?$/);
const currentPathname = window.location.pathname;
const sameOriginReferrer = (() => {
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin) {
      return referrer;
    }
  } catch (error) {
    return null;
  }
  return null;
})();
const referrerProduct = (() => {
  const path = sameOriginReferrer?.pathname.match(/^\/products\/([^/]+)\/([^/]+)\/?$/);
  if (sameOriginReferrer && path) {
    return { category: path[1], slug: path[2], url: sameOriginReferrer.href };
  }
  return null;
})();
const currentCategoryPath = currentPathname.match(/^\/products\/([^/]+)\/?$/);
const buildPageWhatsAppMessage = () => {
  if (currentProductTitle && currentProductPath) {
    return `Hello YIC, I would like a quote for ${currentProductTitle}. Product page: ${window.location.href}`;
  }
  if (currentCategoryPath && categoryDisplayNames[currentCategoryPath[1]]) {
    const categoryName = categoryDisplayNames[currentCategoryPath[1]];
    return `Hello YIC, I would like a commercial inflatable quote for the ${categoryName} category. Category page: ${window.location.href}`;
  }
  return `Hello YIC, I would like a commercial inflatable quote. Page: ${window.location.href}`;
};
const applyWhatsAppMessageToLinks = (message) => {
  const href = `https://wa.me/8613580380807?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('a[href*="wa.me/8613580380807"], a[href*="api.whatsapp.com/send"]').forEach((link) => {
    link.href = href;
  });
  return href;
};
if (currentProductTitle && currentProductPath) {
  document.querySelectorAll('a[href*="/contact/?product="]').forEach((link) => {
    const url = new URL(link.href, window.location.origin);
    url.searchParams.set('product', currentProductPath[2]);
    url.searchParams.set('product_name', currentProductTitle);
    url.searchParams.set('product_category', currentProductPath[1]);
    url.searchParams.set('product_url', window.location.pathname);
    link.href = `${url.pathname}${url.search}`;
  });
}
applyWhatsAppMessageToLinks(buildPageWhatsAppMessage());

const inquiryForm = document.querySelector('#inquiry-form');
if (!productParam && inquiryForm) {
  const categoryPath = sameOriginReferrer?.pathname.match(/^\/products\/([^/]+)\/?$/);
  let contextValue = 'General commercial inflatable inquiry';
  let contextUrl = `${window.location.origin}/`;
  let contextLinkText = 'View homepage ->';
  let selectValue = null;
  if (currentPathname === '/') {
    contextValue = 'Homepage inquiry';
  } else if (categoryPath) {
    const categorySlug = categoryPath[1];
    contextValue = `${categoryDisplayNames[categorySlug] || readableProductName(categorySlug)} inquiry`;
    contextUrl = sameOriginReferrer.href;
    contextLinkText = 'View category page ->';
    selectValue = categoryProductSelectLabels[categorySlug] || null;
  } else if (sameOriginReferrer) {
    contextValue = 'Source page inquiry';
    contextUrl = sameOriginReferrer.href;
    contextLinkText = 'View source page ->';
  }
  const contextField = document.createElement('label');
  contextField.className = 'product-context-field';
  contextField.innerHTML = 'Inquiry source<input name="productModel" type="text" readonly>';
  contextField.querySelector('input').value = contextValue;
  const productPageLink = document.createElement('a');
  productPageLink.className = 'product-context-link';
  productPageLink.href = new URL(contextUrl, window.location.origin).href;
  productPageLink.target = '_blank';
  productPageLink.rel = 'noopener';
  productPageLink.textContent = contextLinkText;
  contextField.append(productPageLink);
  const messageField = inquiryForm.querySelector('textarea[name="message"]')?.closest('label');
  if (messageField) inquiryForm.insertBefore(contextField, messageField);
  else inquiryForm.append(contextField);
  const productSlugField = document.createElement('input');
  productSlugField.type = 'hidden';
  productSlugField.name = 'productSlug';
  productSlugField.value = currentPathname === '/' ? 'homepage-inquiry' : 'general-inquiry';
  const productUrlField = document.createElement('input');
  productUrlField.type = 'hidden';
  productUrlField.name = 'productUrl';
  productUrlField.value = new URL(contextUrl, window.location.origin).href;
  inquiryForm.append(productSlugField, productUrlField);
  if (selectValue && productSelect) {
    const matchingOption = Array.from(productSelect.options).find((option) => option.value === selectValue);
    if (matchingOption) productSelect.value = matchingOption.value;
  }
}
if (productParam && inquiryForm) {
  const isCategoryLanding = Boolean(categoryLandingPages[productParam]);
  if (isCategoryLanding) {
    const categoryName = categoryDisplayNames[productParam] || readableProductName(productParam);
    const productUrl = new URL(categoryLandingPages[productParam], window.location.origin).href;
    const contextField = document.createElement('label');
    contextField.className = 'product-context-field';
    contextField.innerHTML = 'Inquiry source<input name="productModel" type="text" readonly>';
    contextField.querySelector('input').value = `${categoryName} inquiry`;
    const productPageLink = document.createElement('a');
    productPageLink.className = 'product-context-link';
    productPageLink.href = productUrl;
    productPageLink.target = '_blank';
    productPageLink.rel = 'noopener';
    productPageLink.textContent = 'View category page ->';
    contextField.append(productPageLink);
    const messageField = inquiryForm.querySelector('textarea[name="message"]')?.closest('label');
    if (messageField) inquiryForm.insertBefore(contextField, messageField);
    else inquiryForm.append(contextField);
    const productSlugField = document.createElement('input');
    productSlugField.type = 'hidden';
    productSlugField.name = 'productSlug';
    productSlugField.value = productParam;
    const productUrlField = document.createElement('input');
    productUrlField.type = 'hidden';
    productUrlField.name = 'productUrl';
    productUrlField.value = productUrl;
    inquiryForm.append(productSlugField, productUrlField);
    const categoryOption = Array.from(productSelect?.options || []).find((option) => option.value === (categoryProductSelectLabels[productParam] || ''));
    if (categoryOption && productSelect) productSelect.value = categoryOption.value;
  } else {
  const productName = contactParams.get('product_name') || readableProductName(productParam);
  const productCategory = contactParams.get('product_category') || referrerProduct?.category;
  const productUrl = contactParams.get('product_url') || referrerProduct?.url || categoryLandingPages[productParam] || (productCategory ? `/products/${productCategory}/${productParam}/` : `/products/${productParam}/`);
  const contextField = document.createElement('label');
  contextField.className = 'product-context-field';
  contextField.innerHTML = 'Specific product / model<input name="productModel" type="text" readonly>';
  contextField.querySelector('input').value = productName;
  const productPageLink = document.createElement('a');
  productPageLink.className = 'product-context-link';
  productPageLink.href = new URL(productUrl, window.location.origin).href;
  productPageLink.target = '_blank';
  productPageLink.rel = 'noopener';
  productPageLink.textContent = 'View product page ->';
  contextField.append(productPageLink);
  const messageField = inquiryForm.querySelector('textarea[name="message"]')?.closest('label');
  if (messageField) inquiryForm.insertBefore(contextField, messageField);
  else inquiryForm.append(contextField);
  const productSlugField = document.createElement('input');
  productSlugField.type = 'hidden';
  productSlugField.name = 'productSlug';
  productSlugField.value = productParam;
  const productUrlField = document.createElement('input');
  productUrlField.type = 'hidden';
  productUrlField.name = 'productUrl';
  productUrlField.value = new URL(productUrl, window.location.origin).href;
  inquiryForm.append(productSlugField, productUrlField);
  const categoryLabels = {
    'bounce-house-combos': 'Bounce houses & combos',
    'bounce-houses': 'Bounce houses & combos',
    'inflatable-water-slides': 'Water slides & water parks',
    'inflatable-water-parks': 'Water slides & water parks',
    'inflatable-slides': 'Water slides & water parks',
    'obstacle-courses': 'Obstacle courses',
    'theme-parks': 'Theme parks & custom projects',
    'sports-games': 'Sports games',
    'mechanical-rides': 'Other inflatable products',
    'inflatable-tents': 'Other inflatable products',
    'advertising-inflatables': 'Other inflatable products'
  };
  const category = categoryLabels[productCategory];
  const categoryOption = category && Array.from(productSelect?.options || []).find((option) => option.value === category);
  if (categoryOption && productSelect) productSelect.value = categoryOption.value;
  }
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    if (link.matches('.nav-products > a') && window.matchMedia('(max-width: 900px)').matches && !link.parentElement.classList.contains('is-open')) return;
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.nav-products').forEach((group) => {
  const trigger = group.querySelector(':scope > a');
  trigger?.addEventListener('click', (event) => {
    if (window.matchMedia('(max-width: 900px)').matches && !group.classList.contains('is-open')) {
      event.preventDefault();
      group.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

const inquiryFormForSubmit = document.querySelector('#inquiry-form');
if (inquiryFormForSubmit) {
  const formStatus = document.createElement('p');
  formStatus.className = 'form-status';
  formStatus.setAttribute('role', 'status');
  const formActions = inquiryFormForSubmit.querySelector('.form-actions');
  if (formActions) formActions.before(formStatus);
  else inquiryFormForSubmit.append(formStatus);
  const formNote = inquiryFormForSubmit.querySelector('.form-note');
  if (formNote) formNote.textContent = 'Your inquiry is sent securely. YIC will reply by email or WhatsApp.';
  const submitButton = inquiryFormForSubmit.querySelector('button[type="submit"]');
  const buildInquiryEmail = (formData) => {
    const subject = `Inflatable project inquiry from ${formData.get('name')}`;
    const body = [
      `Name: ${formData.get('name')}`,
      `Work email: ${formData.get('email')}`,
      `Buyer type: ${formData.get('buyerType') || 'Not specified'}`,
      `Country / market: ${formData.get('country') || 'Not specified'}`,
      `Interested in: ${formData.get('product')}`,
      `Specific product / model: ${formData.get('productModel') || 'General inquiry'}`,
      `Product page: ${formData.get('productUrl') || 'Not specified'}`,
      `Quantity / timeline: ${formData.get('timeline') || 'Not specified'}`,
      '',
      'Project details:',
      formData.get('message') || 'Not specified'
    ].join('\n');
    return { subject, body };
  };
  inquiryFormForSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryFormForSubmit);
    const email = buildInquiryEmail(formData);
    const originalButtonText = submitButton?.textContent || 'Send by email';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending your inquiry securely...';
    formData.append('_subject', email.subject);
    formData.append('_replyto', formData.get('email'));
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    try {
      const response = await fetch('https://formsubmit.co/ajax/inflatablesgame@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      formStatus.className = 'form-status is-success';
      formStatus.textContent = 'Your inquiry has been sent successfully. YIC will reply by email.';
      if (submitButton) submitButton.textContent = 'Sent';
    } catch (error) {
      formStatus.className = 'form-status is-error';
      formStatus.textContent = 'Online submission needs one-time email activation or is temporarily unavailable. ';
      const fallback = document.createElement('a');
      fallback.href = `mailto:inflatablesgame@gmail.com?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      fallback.textContent = 'Open an email draft instead';
      formStatus.append(fallback, '.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

const buildWhatsAppInquiryMessage = (formData) => {
  const productModel = formData.get('productModel') || 'General inquiry';
  const productUrl = formData.get('productUrl') || window.location.href;
  const isGenericInquiry = productModel === 'General inquiry'
    || productModel === 'General commercial inflatable inquiry'
    || productModel === 'Homepage inquiry'
    || productModel === 'Source page inquiry';
  return [
    isGenericInquiry
      ? 'Hello YIC, I would like a commercial inflatable quote.'
      : `Hello YIC, I would like a quote for ${productModel}.`,
    `Name: ${formData.get('name') || 'Not specified'}`,
    `Buyer type: ${formData.get('buyerType') || 'Not specified'}`,
    `Country / market: ${formData.get('country') || 'Not specified'}`,
    `Product: ${formData.get('product') || 'Not specified'}`,
    `Specific product / model: ${productModel}`,
    `Product page: ${productUrl}`,
    `Quantity / timeline: ${formData.get('timeline') || 'Not specified'}`,
    `Project details: ${formData.get('message') || 'Not specified'}`
  ].join('\n');
};

document.querySelectorAll('[data-whatsapp-cta]').forEach((link) => {
  const updateWhatsAppHref = () => {
    const form = link.closest('form');
    if (!form) return null;
    const formData = new FormData(form);
    const message = buildWhatsAppInquiryMessage(formData);
    const href = `https://wa.me/8613580380807?text=${encodeURIComponent(message)}`;
    link.href = href;
    return href;
  };
  updateWhatsAppHref();
  link.addEventListener('click', (event) => {
    const href = updateWhatsAppHref();
    if (!href) return;
    event.preventDefault();
    window.location.href = href;
  });
  const form = link.closest('form');
  form?.addEventListener('input', updateWhatsAppHref);
  form?.addEventListener('change', updateWhatsAppHref);
});
