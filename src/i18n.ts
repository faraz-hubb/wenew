export type Language = 'en' | 'hy';

export interface ServiceText {
  categoryLabel: string;
  title: string;
  summary: string;
  deliverables: string[];
  metric: string;
}

export interface SiteCopy {
  nav: {
    overview: string;
    services: string;
    about: string;
    contact: string;
    startProject: string;
    openMenu: string;
    closeMenu: string;
    switchLangAria: string;
  };
  hero: {
    stages: string[];
    beat1: {
      eyebrow: string;
      titlePre: string;
      titleAccent: string;
      summary: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    beat2: {
      eyebrow: string;
      titlePre: string;
      titleAccent: string;
      summary: string;
      pills: string[];
    };
    beat3: {
      eyebrow: string;
      title: string;
      summary: string;
      cta: string;
    };
    beat4: {
      eyebrow: string;
      title: string;
      summary: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    scrollExplore: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: {
      all: string;
      websites: string;
      apps: string;
      design: string;
    };
    startWithThis: string;
    items: {
      websites: ServiceText;
      'web-apps': ServiceText;
      'interactive-ui': ServiceText;
      'growth-support': ServiceText;
    };
    graphic: {
      badge: string;
      portalTitle: string;
      portalSub: string;
      flowLabel: string;
      syncLabel: string;
      uptimeValue: string;
      uptimeLabel: string;
      careLabel: string;
    };
    metrics: { value: string; label: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    principles: {
      id: string;
      label: string;
      headline: string;
      description: string;
      studioNote: string;
    }[];
    quote: string;
    quoteAuthor: string;
    quoteRole: string;
    workWithUs: string;
    archTitle: string;
    archSub: string;
    nodes: Record<string, { label: string; role: string; detail: string }>;
    layerLabel: string;
    focusLabel: string;
    integrationsLabel: string;
    modulesWord: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    timelineLabel: string;
    timelines: string[];
    emailLabel: string;
    hubsLabel: string;
    hubsValue: string;
    responseLabel: string;
    responseValue: string;
    successTitle: string;
    successBodyPre: string;
    successBodyMid: string;
    successBodyReply: string;
    successBodyEnd: string;
    scopeLabel: string;
    timelineSummaryLabel: string;
    submitAnother: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      nameError: string;
      emailLabel: string;
      emailPlaceholder: string;
      emailRequiredError: string;
      emailInvalidError: string;
      companyLabel: string;
      companyPlaceholder: string;
      topicLabel: string;
      buildFormatsLabel: string;
      buildFormats: string[];
      messageLabel: string;
      messagePlaceholder: string;
      messageError: string;
      footerNote: string;
      submitBtn: string;
    };
  };
  footer: {
    tagline: string;
    rights: string;
  };
}

export const COPY: Record<Language, SiteCopy> = {
  en: {
    nav: {
      overview: 'Overview',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      startProject: 'Start Project',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      switchLangAria: 'Switch website language',
    },
    hero: {
      stages: [
        '01. Built for Everyone',
        '02. Websites & Apps',
        '03. No Barriers',
        '04. WENEW Mark',
      ],
      beat1: {
        eyebrow: 'WENEW Digital Studio',
        titlePre: 'Websites & apps built for ',
        titleAccent: 'everyone.',
        summary:
          'From solo creators and local shops to scaling companies, we design and engineer fast, modern websites and custom applications tailored to your vision.',
        ctaPrimary: 'Start Your Project',
        ctaSecondary: 'Explore Services',
      },
      beat2: {
        eyebrow: '02. Design & Engineering Together',
        titlePre: 'Software shaped around ',
        titleAccent: 'your audience.',
        summary:
          'No bloated templates or confusing jargon—we pair clean interfaces, responsive code, and reliable cloud backends so anyone can launch with confidence.',
        pills: ['Responsive websites', 'Web & mobile apps', 'Built to scale'],
      },
      beat3: {
        eyebrow: '03. Technology Without Barriers',
        title: "Great digital products shouldn't belong only to massive tech companies.",
        summary:
          'Whether you need your very first online storefront, a booking platform, or a full-featured mobile application, WENEW turns complex engineering into effortless launches.',
        cta: 'Form WENEW Mark',
      },
      beat4: {
        eyebrow: '04. Launch With WENEW',
        title: 'Ready to build what comes next.',
        summary:
          'Every scattered particle converges to form our radiant emblem—hover to interact with the mark or explore our custom websites and application services below.',
        ctaPrimary: 'Start Your Project',
        ctaSecondary: 'Explore What We Build',
      },
      scrollExplore: 'Scroll to explore',
    },
    services: {
      eyebrow: 'What We Build',
      title: 'Websites and applications engineered for clarity, speed, and everyday people.',
      subtitle:
        'Every engagement at WENEW pairs thoughtful UI design with clean, dependable code—tailored to your goals and budget.',
      filters: {
        all: 'All Services',
        websites: 'Websites',
        apps: 'Applications',
        design: 'Product & UI',
      },
      startWithThis: 'Start With This',
      items: {
        websites: {
          categoryLabel: 'Websites',
          title: 'Custom Websites & Brand Platforms',
          summary:
            'High-speed, mobile-first websites crafted for creators, local businesses, and ambitious companies. Engineered for crisp typography, fluid motion, and search visibility out of the box.',
          deliverables: [
            'Responsive layouts tuned for phone, tablet & desktop',
            'Custom landing pages, portfolios & e-commerce storefronts',
            'Clean SEO metadata, analytics & fast edge hosting',
          ],
          metric: 'Sub-second load times · Easy CMS content updates',
        },
        'web-apps': {
          categoryLabel: 'Applications',
          title: 'Web & Mobile Applications',
          summary:
            'Full-stack web apps, SaaS dashboards, booking portals, and cross-platform iOS/Android experiences designed for everyday users and reliable scale.',
          deliverables: [
            'Intuitive React, TypeScript & native mobile builds',
            'Secure user accounts, payments & real-time sync',
            'Clean API architecture ready for future growth',
          ],
          metric: 'iOS, Android & modern web from a unified build',
        },
        'interactive-ui': {
          categoryLabel: 'Product & UI',
          title: 'Interactive UI, 3D & Design Systems',
          summary:
            'Memorable product interfaces, dark/light component libraries, and WebGL micro-interactions that turn first-time visitors into loyal customers.',
          deliverables: [
            'Interactive prototypes & visual design systems',
            'Accessible WCAG-compliant color & focus states',
            'Smooth scroll storytelling & real-time 3D accents',
          ],
          metric: 'Figma-to-production component handoff included',
        },
        'growth-support': {
          categoryLabel: 'Applications',
          title: 'Client Portals, Automation & Care',
          summary:
            'Practical custom software for everyday workflows—customer portals, scheduling tools, automated billing, and continuous post-launch updates.',
          deliverables: [
            'Tailored admin dashboards & workflow automation',
            'Stripe checkout, CRM & calendar integrations',
            'Ongoing updates, backups & uptime monitoring',
          ],
          metric: 'Dedicated engineering support after launch day',
        },
      },
      graphic: {
        badge: 'System Blueprint',
        portalTitle: 'Client Portal Suite',
        portalSub: 'Unified Workspace',
        flowLabel: 'Auto Billing',
        syncLabel: 'CRM & Booking Sync',
        uptimeValue: '99.9%',
        uptimeLabel: 'Cloud Uptime',
        careLabel: 'Care Plan Active',
      },
      metrics: [
        { value: '2–4 wks', label: 'Typical kickoff-to-launch timeline for custom sites' },
        { value: '120+', label: 'Websites & apps shipped for founders and teams' },
        { value: '99.9%', label: 'Production uptime across managed cloud deployments' },
        { value: '100%', label: 'Accessible, responsive code built for everyone' },
      ],
    },
    about: {
      eyebrow: 'About WENEW',
      title: 'A creative engineering studio making custom websites and apps accessible to everyone.',
      subtitle:
        'Founded by product designers and software engineers, WENEW partners with independent creators, neighborhood businesses, and fast-moving startups to turn ideas into polished digital products.',
      principles: [
        {
          id: 'everyone',
          label: '01. Built for Everyone',
          headline: 'Clear pricing, friendly guidance, and software anyone can use.',
          description:
            'You do not need an engineering background to launch a remarkable website or app. We translate your goals into simple milestones, plain-language updates, and intuitive interfaces.',
          studioNote: 'Transparent project scopes · Designed for non-technical founders & teams',
        },
        {
          id: 'craft',
          label: '02. Design & Code Together',
          headline: 'Designers and engineers collaborate from day one.',
          description:
            'Instead of handing static mockups over a wall, our product designers and full-stack developers build together in live prototypes—making sure every scroll, tap, and API responds seamlessly.',
          studioNote: 'Unified design-to-code workflow · Interactive staging previews',
        },
        {
          id: 'speed',
          label: '03. Speed & Reliability',
          headline: 'Modern web standards built to grow with your business.',
          description:
            'From clean responsive layouts to secure authentication, databases, and cloud hosting, every WENEW launch ships fast, ranks cleanly on search, and stays easy to maintain.',
          studioNote: '99.9% uptime architecture · Full source ownership & training',
        },
      ],
      quote:
        '“WENEW took our rough napkin sketch and launched both our marketing site and customer booking app in three weeks. Our online orders doubled in the first month.”',
      quoteAuthor: 'Jordan Alvarez',
      quoteRole: 'Founder, Harborline Goods',
      workWithUs: 'Work With Us',
      archTitle: 'WENEW Build Architecture',
      archSub: 'Hover or select a capability node to see how every product ships',
      nodes: {
        hub: { label: 'WENEW Studio', role: 'Unified Product Core', detail: 'Weekly live demos' },
        websites: { label: 'Websites', role: 'Marketing & Storefronts', detail: 'SEO & sub-second speed' },
        apps: { label: 'Mobile & Web Apps', role: 'iOS, Android & SaaS', detail: 'Full-stack TypeScript' },
        cloud: { label: 'Cloud & APIs', role: 'Auth, Data & Payments', detail: 'Scalable architecture' },
        ui: { label: 'UI & 3D Motion', role: 'Design Systems', detail: 'Accessible & responsive' },
        launch: { label: 'Launch & Care', role: 'QA & Ongoing Updates', detail: 'Post-launch support' },
      },
      layerLabel: 'Selected Layer',
      focusLabel: 'Focus',
      integrationsLabel: 'Integrations',
      modulesWord: 'modules',
    },
    contact: {
      eyebrow: 'Start a Project',
      title: "Tell us what you're building. We'll help bring it online.",
      subtitle:
        "Whether it's your very first website or a custom web and mobile application, our product team will reply within 24 hours with a clear roadmap and estimate.",
      timelineLabel: 'Target launch window',
      timelines: ['ASAP (2–4 weeks)', '1–2 Months', 'Flexible / Exploring'],
      emailLabel: 'Project inquiries',
      hubsLabel: 'Collaboration hubs',
      hubsValue: 'Yerevan · New York · Worldwide Remote',
      responseLabel: 'Response time',
      responseValue: 'Mon–Fri · Proposals delivered within 24 hours',
      successTitle: 'Project inquiry received',
      successBodyPre: 'Thanks, ',
      successBodyMid: '. Our team has received your brief for ',
      successBodyReply: ' and will reply to ',
      successBodyEnd: ' within one business day.',
      scopeLabel: 'Build scope:',
      timelineSummaryLabel: 'Target timeline:',
      submitAnother: 'Submit another project',
      form: {
        nameLabel: 'Your name',
        namePlaceholder: 'Alex Morgan',
        nameError: 'Please enter your name.',
        emailLabel: 'Email address',
        emailPlaceholder: 'alex@company.com',
        emailRequiredError: 'Please enter your email address.',
        emailInvalidError: 'Please enter a valid email address (e.g. alex@company.com).',
        companyLabel: 'Brand or organization (optional)',
        companyPlaceholder: 'Studio, shop, or personal project',
        topicLabel: 'Service focus',
        buildFormatsLabel: 'What are we building?',
        buildFormats: ['Custom Website', 'Web / Mobile App', 'Full Product Suite'],
        messageLabel: 'Tell us about your idea',
        messagePlaceholder:
          'Briefly describe your website or application goals, key features, and audience.',
        messageError:
          'Please share a brief overview (at least 10 characters) of what you want to build.',
        footerNote: 'Free discovery call · Clear fixed-scope proposals.',
        submitBtn: 'Send Project Brief',
      },
    },
    footer: {
      tagline: 'Websites & Applications for Everyone',
      rights: 'WENEW Studio. All rights reserved.',
    },
  },
  hy: {
    nav: {
      overview: 'Ընդհանուր',
      services: 'Ծառայություններ',
      about: 'Մեր մասին',
      contact: 'Կապ',
      startProject: 'Սկսել նախագիծ',
      openMenu: 'Բացել ընտրացանկը',
      closeMenu: 'Փակել ընտրացանկը',
      switchLangAria: 'Փոխել կայքի լեզուն',
    },
    hero: {
      stages: [
        '01. Բոլորի համար',
        '02. Կայքեր և հավելվածներ',
        '03. Առանց խոչընդոտների',
        '04. WENEW նշան',
      ],
      beat1: {
        eyebrow: 'WENEW թվային ստուդիա',
        titlePre: 'Կայքեր և հավելվածներ՝ ստեղծված ',
        titleAccent: 'բոլորի համար։',
        summary:
          'Անհատ ստեղծագործողներից և տեղական բիզնեսներից մինչև արագ աճող ընկերություններ՝ մենք նախագծում ու կառուցում ենք արագ, ժամանակակից կայքեր և հավելվածներ՝ հարմարեցված ձեր տեսլականին։',
        ctaPrimary: 'Սկսել նախագիծը',
        ctaSecondary: 'Դիտել ծառայությունները',
      },
      beat2: {
        eyebrow: '02. Դիզայն և ինժեներություն միասին',
        titlePre: 'Ծրագրային լուծումներ՝ ',
        titleAccent: 'ձեր լսարանի համար։',
        summary:
          'Առանց ավելորդ շաբլոնների ու բարդ տերմինների՝ մենք համադրում ենք մաքուր ինտերֆեյսները, արագ կոդը և հուսալի ամպային համակարգերը վստահ մեկնարկի համար։',
        pills: ['Ադապտիվ կայքեր', 'Վեբ և մոբայլ հավելվածներ', 'Պատրաստ աճի համար'],
      },
      beat3: {
        eyebrow: '03. Տեխնոլոգիա առանց խոչընդոտների',
        title: 'Որակյալ թվային պրոդուկտները չպետք է պատկանեն միայն տեխնոլոգիական հսկաներին։',
        summary:
          'Անկախ նրանից՝ ձեզ անհրաժեշտ է առաջին առցանց խանութը, ամրագրման հարթակ, թե ամբողջական մոբայլ հավելված, WENEW-ը բարդ տեխնիկական աշխատանքը դարձնում է պարզ ու արդյունավետ։',
        cta: 'Տեսնել WENEW նշանը',
      },
      beat4: {
        eyebrow: '04. Մեկնարկեք WENEW-ի հետ',
        title: 'Պատրաստ ենք կառուցել ձեր հաջորդ քայլը։',
        summary:
          'Ցրված բոլոր մասնիկները միավորվում են մեր լուսավոր խորհրդանիշի մեջ՝ շարժեք կուրսորը փոխազդելու համար կամ ծանոթացեք մեր ծառայություններին ստորև։',
        ctaPrimary: 'Սկսել նախագիծը',
        ctaSecondary: 'Ինչ ենք մենք ստեղծում',
      },
      scrollExplore: 'Ոլորեք՝ ուսումնասիրելու համար',
    },
    services: {
      eyebrow: 'Ինչ ենք մենք ստեղծում',
      title: 'Կայքեր և հավելվածներ՝ ստեղծված պարզության, արագության և իրական մարդկանց համար։',
      subtitle:
        'WENEW-ի յուրաքանչյուր նախագիծ համադրում է մտածված UI դիզայնն ու հուսալի կոդը՝ հարմարեցված ձեր նպատակներին և բյուջեին։',
      filters: {
        all: 'Բոլորը',
        websites: 'Կայքեր',
        apps: 'Հավելվածներ',
        design: 'Պրոդուկտ և UI',
      },
      startWithThis: 'Ընտրել այս ծառայությունը',
      items: {
        websites: {
          categoryLabel: 'Կայքեր',
          title: 'Անհատական կայքեր և բրենդային հարթակներ',
          summary:
            'Բարձր արագությամբ, մոբայլ-առաջնահերթ կայքեր՝ ստեղծված հեղինակների, տեղական բիզնեսների և հավակնոտ ընկերությունների համար։ Հստակ տիպոգրաֆիկա, սահուն շարժում և SEO պատրաստականություն։',
          deliverables: [
            'Ադապտիվ դիզայն՝ հեռախոսի, պլանշետի և համակարգչի համար',
            'Լենդինգ էջեր, պորտֆոլիոներ և առցանց խանութներ',
            'Մաքուր SEO մետատվյալներ, վերլուծություն և արագ հոսթինգ',
          ],
          metric: 'Վայրկյանական բեռնում · Հեշտ կառավարվող բովանդակություն',
        },
        'web-apps': {
          categoryLabel: 'Հավելվածներ',
          title: 'Վեբ և մոբայլ հավելվածներ',
          summary:
            'Ամբողջական վեբ հավելվածներ, SaaS վահանակներ, ամրագրման համակարգեր և iOS/Android լուծումներ՝ նախատեսված ամենօրյա օգտագործման և կայուն զարգացման համար։',
          deliverables: [
            'Ինտուիտիվ React, TypeScript և մոբայլ հավելվածներ',
            'Անվտանգ հաշիվներ, առցանց վճարումներ և իրական ժամանակի սինքրոնիզացիա',
            'Մաքուր API ճարտարապետություն՝ ապագա ընդլայնման համար',
          ],
          metric: 'iOS, Android և վեբ հարթակներ՝ մեկ միասնական համակարգից',
        },
        'interactive-ui': {
          categoryLabel: 'Պրոդուկտ և UI',
          title: 'Ինտերակտիվ UI, 3D և դիզայն համակարգեր',
          summary:
            'Տպավորիչ ինտերֆեյսներ, բաղադրիչների գրադարաններ և WebGL միկրո-անիմացիաներ, որոնք առաջին այցելուներին վերածում են հավատարիմ հաճախորդների։',
          deliverables: [
            'Ինտերակտիվ նախատիպեր և տեսողական դիզայն համակարգեր',
            'Մատչելի WCAG չափանիշներին համապատասխան գույներ և հակադրություն',
            'Սահուն ոլորման պատմություններ և 3D ինտերակտիվ տարրեր',
          ],
          metric: 'Figma-ից մինչև պատրաստի կոդ՝ ամբողջական փոխանցում',
        },
        'growth-support': {
          categoryLabel: 'Հավելվածներ',
          title: 'Հաճախորդների պորտալներ, ավտոմատացում և սպասարկում',
          summary:
            'Գործնական ծրագրային լուծումներ ամենօրյա աշխատանքի համար՝ հաճախորդների անձնական կաբինետներ, ժամանակացույցի գործիքներ, ավտոմատ հաշվառում և մշտական թարմացումներ։',
          deliverables: [
            'Անհատական ադմին վահանակներ և աշխատանքային պրոցեսների ավտոմատացում',
            'Վճարային համակարգերի, CRM-ի և օրացույցների ինտեգրում',
            'Շարունակական թարմացումներ, կրկնօրինակում և հսկողություն',
          ],
          metric: 'Նվիրված տեխնիկական աջակցություն մեկնարկից հետո',
        },
      },
      graphic: {
        badge: 'Համակարգի գծապատկեր',
        portalTitle: 'Հաճախորդի պորտալ',
        portalSub: 'Միասնական կառավարում',
        flowLabel: 'Ավտոմատ վճարում',
        syncLabel: 'CRM և օրացույց',
        uptimeValue: '99.9%',
        uptimeLabel: 'Անխափան աշխատանք',
        careLabel: 'Ակտիվ սպասարկում',
      },
      metrics: [
        { value: '2–4 շբթ', label: 'Մեկնարկից մինչև պատրաստի կայքի միջին ժամկետ' },
        { value: '120+', label: 'Հաջողությամբ թողարկված կայքեր և հավելվածներ' },
        { value: '99.9%', label: 'Կայուն աշխատանք կառավարվող ամպային սերվերներում' },
        { value: '100%', label: 'Մատչելի և արագ ադապտիվ կոդ բոլոր սարքերի համար' },
      ],
    },
    about: {
      eyebrow: 'WENEW-ի մասին',
      title: 'Ստեղծարար ինժեներական ստուդիա, որը բարձրակարգ կայքերն ու հավելվածները դարձնում է հասանելի բոլորին։',
      subtitle:
        'Հիմնադրված պրոդուկտ դիզայներների և ծրագրավորողների կողմից՝ WENEW-ը համագործակցում է անկախ հեղինակների, տեղական բիզնեսների և ստարտափների հետ՝ գաղափարները դարձնելով իրական թվային պրոդուկտներ։',
      principles: [
        {
          id: 'everyone',
          label: '01. Բոլորի համար',
          headline: 'Հստակ գնագոյացում, ընկերական աջակցություն և հեշտ կառավարվող ծրագրեր։',
          description:
            'Հրաշալի կայք կամ հավելված գործարկելու համար տեխնիկական կրթություն պետք չէ։ Մենք ձեր նպատակները վերածում ենք պարզ փուլերի և հարմարավետ ինտերֆեյսների։',
          studioNote: 'Թափանցիկ աշխատանքային փուլեր · Ստեղծված բիզնեսի և ստեղծագործողների համար',
        },
        {
          id: 'craft',
          label: '02. Դիզայն և կոդ միասին',
          headline: 'Դիզայներներն ու ծրագրավորողները աշխատում են համատեղ՝ առաջին իսկ օրվանից։',
          description:
            'Ստատիկ նկարների փոխարեն մեր թիմը միասին ստեղծում է կենդանի նախատիպեր՝ ապահովելով, որ յուրաքանչյուր սեղմում, ոլորում և API արձագանքի անթերի։',
          studioNote: 'Դիզայնից դեպի կոդ միասնական հոսք · Իրական ժամանակի դիտում',
        },
        {
          id: 'speed',
          label: '03. Արագություն և հուսալիություն',
          headline: 'Ժամանակակից վեբ ստանդարտներ՝ պատրաստ ձեր բիզնեսի աճին։',
          description:
            'Ադապտիվ կառուցվածքից մինչև անվտանգ մուտք, տվյալների բազաներ և ամպային հոսթինգ՝ WENEW-ի յուրաքանչյուր պրոդուկտ արագ է և հեշտ սպասարկվող։',
          studioNote: '99.9% կայուն ճարտարապետություն · Ամբողջական կոդի սեփականություն',
        },
      ],
      quote:
        '«WENEW-ը մեր թղթի վրա արված ուրվագծից ընդամենը երեք շաբաթում ստեղծեց թե՛ կայքը, թե՛ ամրագրման հավելվածը։ Առցանց պատվերները կրկնապատկվեցին առաջին իսկ ամսում»։',
      quoteAuthor: 'Ջորդան Ալվարես',
      quoteRole: 'Հիմնադիր, Harborline Goods',
      workWithUs: 'Աշխատել մեզ հետ',
      archTitle: 'WENEW կառուցման ճարտարապետություն',
      archSub: 'Անցեք կամ ընտրեք հանգույցը՝ տեսնելու մեր աշխատանքային համակարգը',
      nodes: {
        hub: { label: 'WENEW ստուդիա', role: 'Միասնական միջուկ', detail: 'Շաբաթական դեմո ցուցադրություն' },
        websites: { label: 'Կայքեր', role: 'Բրենդ և խանութներ', detail: 'SEO և բարձր արագություն' },
        apps: { label: 'Մոբայլ և վեբ', role: 'iOS, Android և SaaS', detail: 'TypeScript ամբողջական կոդ' },
        cloud: { label: 'Ամպ և API', role: 'Մուտք, տվյալներ և վճարում', detail: 'Ընդլայնվող համակարգ' },
        ui: { label: 'UI և 3D շարժում', role: 'Դիզայն համակարգեր', detail: 'Մատչելի և արագ արձագանքող' },
        launch: { label: 'Մեկնարկ և խնամք', role: 'Թեստավորում և թարմացում', detail: 'Հետմեկնարկային աջակցություն' },
      },
      layerLabel: 'Ընտրված շերտ',
      focusLabel: 'Ուղղվածություն',
      integrationsLabel: 'Կապեր',
      modulesWord: 'մոդուլ',
    },
    contact: {
      eyebrow: 'Սկսել նախագիծ',
      title: 'Պատմեք ձեր գաղափարի մասին։ Մենք կօգնենք իրականացնել այն առցանց։',
      subtitle:
        'Լինի դա ձեր առաջին կայքը, թե անհատական վեբ և մոբայլ հավելված, մեր թիմը կպատասխանի 24 ժամվա ընթացքում՝ հստակ պլանով և գնահատականով։',
      timelineLabel: 'Ցանկալի մեկնարկի ժամկետ',
      timelines: ['Շուտափույթ (2–4 շաբաթ)', '1–2 ամիս', 'Ճկուն / Պարզապես ուսումնասիրում եմ'],
      emailLabel: 'Նախագծերի համար',
      hubsLabel: 'Համագործակցության կենտրոններ',
      hubsValue: 'Երևան · Նյու Յորք · Հեռավար ամբողջ աշխարհում',
      responseLabel: 'Արձագանքի ժամանակ',
      responseValue: 'Երկ–Ուրբ · Առաջարկները պատրաստվում են 24 ժամում',
      successTitle: 'Ձեր հայտը ստացված է',
      successBodyPre: 'Շնորհակալություն, ',
      successBodyMid: '։ Մենք ստացանք ձեր հարցումը ',
      successBodyReply: ' ուղղությամբ և կպատասխանենք ',
      successBodyEnd: ' էլ․ հասցեին մեկ աշխատանքային օրում։',
      scopeLabel: 'Նախագծի ձևաչափ․',
      timelineSummaryLabel: 'Նախատեսված ժամկետ․',
      submitAnother: 'Ուղարկել ևս մեկ հայտ',
      form: {
        nameLabel: 'Ձեր անունը',
        namePlaceholder: 'Արամ Սարգսյան',
        nameError: 'Խնդրում ենք մուտքագրել ձեր անունը։',
        emailLabel: 'Էլ․ հասցե',
        emailPlaceholder: 'aram@company.com',
        emailRequiredError: 'Խնդրում ենք մուտքագրել ձեր էլ․ հասցեն։',
        emailInvalidError: 'Խնդրում ենք մուտքագրել ճիշտ էլ․ հասցե (օր.՝ aram@company.com)։',
        companyLabel: 'Բրենդ կամ կազմակերպություն (ոչ պարտադիր)',
        companyPlaceholder: 'Ստուդիա, խանութ կամ անհատական նախագիծ',
        topicLabel: 'Ծառայության ուղղություն',
        buildFormatsLabel: 'Ի՞նչ ենք ստեղծելու',
        buildFormats: ['Անհատական կայք', 'Վեբ / Մոբայլ հավելված', 'Ամբողջական պրոդուկտ'],
        messageLabel: 'Պատմեք ձեր գաղափարի մասին',
        messagePlaceholder:
          'Հակիրճ նկարագրեք ձեր կայքի կամ հավելվածի նպատակները, հիմնական հնարավորությունները և լսարանը։',
        messageError: 'Խնդրում ենք գրել առնվազն 10 նիշ ձեր գաղափարի մասին։',
        footerNote: 'Անվճար խորհրդատվություն · Հստակ և թափանցիկ առաջարկներ։',
        submitBtn: 'Ուղարկել հայտը',
      },
    },
    footer: {
      tagline: 'Կայքեր և հավելվածներ բոլորի համար',
      rights: 'WENEW Studio. Բոլոր իրավունքները պաշտպանված են։',
    },
  },
};
