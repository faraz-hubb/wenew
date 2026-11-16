import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { COPY, type Language } from '../i18n';

interface ContactSectionProps {
  language: Language;
  preselectedTopic: string;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  botDockRef: React.RefObject<HTMLDivElement | null>;
}

const TOPIC_KEYS = ['websites', 'web-apps', 'interactive-ui', 'growth-support', 'discovery'] as const;

export default function ContactSection({
  language,
  preselectedTopic,
  nameInputRef,
  botDockRef,
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [buildFormatIndex, setBuildFormatIndex] = useState(0);
  const [topicKey, setTopicKey] = useState<string>('websites');
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const t = COPY[language].contact;
  const serviceItems = COPY[language].services.items;

  const topicLabels: Record<string, string> = {
    websites: serviceItems.websites.title,
    'web-apps': serviceItems['web-apps'].title,
    'interactive-ui': serviceItems['interactive-ui'].title,
    'growth-support': serviceItems['growth-support'].title,
    discovery: language === 'hy' ? 'Նախագծի ընդհանուր քննարկում' : 'General Project Discovery',
  };

  useEffect(() => {
    if (preselectedTopic && TOPIC_KEYS.includes(preselectedTopic as (typeof TOPIC_KEYS)[number])) {
      setTopicKey(preselectedTopic);
    }
  }, [preselectedTopic]);

  const validate = () => {
    const nextErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) {
      nextErrors.name = t.form.nameError;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      nextErrors.email = t.form.emailRequiredError;
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = t.form.emailInvalidError;
    }
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = t.form.messageError;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setErrors({});
  };

  const selectedTopicLabel = topicLabels[topicKey] || topicLabels.websites;
  const selectedBuildFormat = t.form.buildFormats[buildFormatIndex] || t.form.buildFormats[0];
  const selectedTimeline = t.timelines[timelineIndex] || t.timelines[0];

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 px-5 sm:px-8 bg-[#040507] border-t border-white/10 overflow-hidden"
    >
      {/* Luminous #44D62C & silver ambient glows behind Apple Glass form & inputs */}
      <div
        aria-hidden="true"
        className="absolute top-[18%] right-[6%] w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(68, 214, 44, 0.16) 0%, rgba(68, 214, 44, 0.05) 44%, transparent 74%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[10%] left-[12%] w-[520px] h-[440px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 232, 240, 0.09) 0%, rgba(68, 214, 44, 0.06) 46%, transparent 74%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Studio Contact Details & Timeline */}
          <ScrollReveal className="lg:col-span-5" delayMs={0}>
            <p className="text-sm font-semibold text-[#44D62C] mb-3">
              {t.eyebrow}
            </p>
            <h2
              className="font-display font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-5"
              style={{
                fontSize: 'clamp(1.9rem, 3.3vw, 2.9rem)',
                textWrap: 'balance',
              }}
            >
              {t.title}
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
              {t.subtitle}
            </p>

            {/* Target Launch Timeline */}
            <div className="mb-8">
              <div className="text-xs font-semibold text-zinc-400 mb-3">
                {t.timelineLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {t.timelines.map((win, idx) => {
                  const active = timelineIndex === idx;
                  return (
                    <button
                      key={win}
                      type="button"
                      onClick={() => setTimelineIndex(idx)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#44D62C] text-black font-semibold border-[#44D62C] shadow-sm'
                          : 'glass-panel text-zinc-300 hover:border-[#44D62C]/50'
                      }`}
                    >
                      {win}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Studio Contact Details */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-[#44D62C] shrink-0">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">{t.emailLabel}</div>
                  <a
                    href="mailto:hello@wenew.studio"
                    className="text-sm font-semibold text-white hover:text-[#44D62C] transition-colors"
                  >
                    hello@wenew.studio
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-[#44D62C] shrink-0">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">{t.hubsLabel}</div>
                  <div className="text-sm font-semibold text-white">
                    {t.hubsValue}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-[#44D62C] shrink-0">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">{t.responseLabel}</div>
                  <div className="text-sm font-semibold text-white">
                    {t.responseValue}
                  </div>
                </div>
              </div>
            </div>

            {/* Seated dock slot for WENEW Studio Bot right above Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-5">
              <div
                ref={botDockRef}
                aria-hidden="true"
                className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 pointer-events-none"
              />
              <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-[26ch]">
                <span className="block font-display font-semibold text-white mb-1">
                  WENEW Bot
                </span>
                <span>
                  {language === 'hy'
                    ? 'Կարո՞ղ եմ օգնել ձեզ։'
                    : 'Can I help you?'}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Dark Glassmorphic Validated Project Inquiry Form */}
          <ScrollReveal className="lg:col-span-7" delayMs={120}>
            <div className="glass-panel rounded-2xl p-6 sm:p-10">
              {submitted ? (
                <div className="py-8 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#44D62C]/15 border border-[#44D62C]/40 flex items-center justify-center text-[#44D62C] mb-5 mx-auto sm:mx-0">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-2">
                    {t.successTitle}
                  </h3>
                  <p className="text-base text-zinc-400 leading-relaxed mb-6 max-w-lg">
                    {t.successBodyPre}
                    <span className="font-semibold text-white">{name}</span>
                    {t.successBodyMid}
                    <span className="font-semibold text-white">{selectedTopicLabel}</span>
                    {t.successBodyReply}
                    <span className="font-semibold text-white">{email}</span>
                    {t.successBodyEnd}
                  </p>
                  <div className="rounded-xl apple-glass-sub p-4 mb-6 text-xs sm:text-sm text-zinc-300 space-y-1.5">
                    <div>
                      <span className="font-semibold text-white">{t.scopeLabel}</span> {selectedBuildFormat}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{t.timelineSummaryLabel}</span> {selectedTimeline}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-black bg-[#44D62C] hover:bg-[#52E43B] rounded-xl transition-colors cursor-pointer"
                  >
                    {t.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-zinc-200 mb-1.5"
                      >
                        {t.form.nameLabel}
                      </label>
                      <input
                        ref={nameInputRef}
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder={t.form.namePlaceholder}
                        aria-invalid={Boolean(errors.name)}
                        className={`w-full px-4 py-3 text-sm text-white placeholder:text-zinc-500 apple-glass-sub rounded-xl outline-none transition-colors ${
                          errors.name
                            ? 'border-rose-500 focus:border-rose-400'
                            : 'focus:border-[#44D62C]'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-zinc-200 mb-1.5"
                      >
                        {t.form.emailLabel}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder={t.form.emailPlaceholder}
                        aria-invalid={Boolean(errors.email)}
                        className={`w-full px-4 py-3 text-sm text-white placeholder:text-zinc-500 apple-glass-sub rounded-xl outline-none transition-colors ${
                          errors.email
                            ? 'border-rose-500 focus:border-rose-400'
                            : 'focus:border-[#44D62C]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-sm font-medium text-zinc-200 mb-1.5"
                      >
                        {t.form.companyLabel}
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={t.form.companyPlaceholder}
                        className="w-full px-4 py-3 text-sm text-white placeholder:text-zinc-500 apple-glass-sub focus:border-[#44D62C] rounded-xl outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-sm font-medium text-zinc-200 mb-1.5"
                      >
                        {t.form.topicLabel}
                      </label>
                      <select
                        id="contact-topic"
                        value={topicKey}
                        onChange={(e) => setTopicKey(e.target.value)}
                        className="w-full px-4 py-3 text-sm text-white apple-glass-sub focus:border-[#44D62C] rounded-xl outline-none transition-colors cursor-pointer [&>option]:bg-[#101318] [&>option]:text-white"
                      >
                        {TOPIC_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {topicLabels[key]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Build Format Selector */}
                  <div>
                    <span className="block text-sm font-medium text-zinc-200 mb-2">
                      {t.form.buildFormatsLabel}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {t.form.buildFormats.map((mode, idx) => {
                        const selected = buildFormatIndex === idx;
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setBuildFormatIndex(idx)}
                            aria-pressed={selected}
                            className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                              selected
                                ? 'bg-[#44D62C] text-black font-semibold border-[#44D62C] shadow-sm'
                                : 'apple-glass-sub text-zinc-300 hover:border-[#44D62C]/50'
                            }`}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-zinc-200 mb-1.5"
                    >
                      {t.form.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      placeholder={t.form.messagePlaceholder}
                      aria-invalid={Boolean(errors.message)}
                      className={`w-full px-4 py-3 text-sm text-white placeholder:text-zinc-500 apple-glass-sub rounded-xl outline-none transition-colors resize-y ${
                        errors.message
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'focus:border-[#44D62C]'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-zinc-400">
                      {t.form.footerNote}
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-black bg-[#44D62C] rounded-xl hover:bg-[#52E43B] active:scale-[0.98] shadow-[0_10px_24px_-6px_rgba(68,214,44,0.45)] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#44D62C]"
                    >
                      <span>{t.form.submitBtn}</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
