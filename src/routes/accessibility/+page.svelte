<script>
  // Accessibility statement. This is the highest-value page on the site from a
  // risk perspective: naming a conformance target, disclosing known limitations,
  // and giving a real person to contact with a stated response time is what
  // gives someone a cheaper path than a demand letter.
  //
  // Every claim on this page must stay TRUE. The "tested on every deployment"
  // sentence is backed by the axe gate in .github/workflows/accessibility.yml —
  // if that workflow is ever removed, remove the claim with it.
  import LegalPage from '$lib/components/LegalPage.svelte'
  import { legal, accessibilityContact } from '$lib/legal/site.js'

  const contact = accessibilityContact()
</script>

<svelte:head>
  <title>Accessibility Statement | {legal.tradeName}</title>
  <meta
    name="description"
    content="{legal.tradeName} is committed to making this website usable by everyone. Read our accessibility commitment and how to request help."
  />
  <link rel="canonical" href="{legal.siteUrl}/accessibility" />
  <meta property="og:title" content="Accessibility Statement | {legal.tradeName}" />
  <meta
    property="og:description"
    content="{legal.tradeName} is committed to making this website usable by everyone. Read our accessibility commitment and how to request help."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{legal.siteUrl}/accessibility" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Accessibility Statement | {legal.tradeName}" />
  <meta
    name="twitter:description"
    content="{legal.tradeName} is committed to making this website usable by everyone. Read our accessibility commitment and how to request help."
  />
</svelte:head>

<LegalPage
  title="Accessibility Statement"
  intro="{legal.tradeName} is committed to making this website usable by as many people as possible, including people with disabilities."
>
  <h2>Our commitment</h2>
  <p>
    We believe everyone should be able to find what they need on this site and get in touch with us
    without barriers. We treat accessibility as part of building and maintaining the site, not as an
    afterthought, and we work on it continuously.
  </p>

  <h2>Conformance target</h2>
  <p>
    We aim to conform to the
    <a href="https://www.w3.org/TR/WCAG21/" rel="noopener noreferrer" target="_blank"
      >Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</a
    >. These guidelines are the internationally recognised standard for making web content
    accessible, and they explain how to make sites work for people with a wide range of
    disabilities — including visual, auditory, physical, speech, cognitive, and neurological
    disabilities.
  </p>

  <h2>What we do</h2>
  <ul>
    <li>
      <strong>Automated testing on every deployment.</strong> Every change to this site is checked against
      the WCAG 2.1 Level AA success criteria that can be tested automatically, and a change that introduces
      a serious or critical issue is blocked before it goes live.
    </li>
    <li>
      <strong>Semantic, keyboard-accessible markup.</strong> The site is built with proper headings, landmarks,
      labelled form fields, and real links and buttons, so it can be navigated by keyboard and understood
      by screen readers.
    </li>
    <li>
      <strong>Readable contrast and text.</strong> We hold body text to a contrast ratio of at least 4.5:1
      and let you resize text without breaking the layout.
    </li>
    <li>
      <strong>Reduced motion.</strong> If your device is set to reduce motion, animations on this site
      are turned off.
    </li>
    <li>
      <strong>No accessibility overlay.</strong> We do not use an accessibility overlay, toolbar, or
      plug-in widget. We fix accessibility in the site itself, because overlays frequently interfere
      with the assistive technology people already use.
    </li>
  </ul>

  <h2>Known limitations</h2>
  <p>
    Despite our efforts, some limitations may remain. We are aware that the following may not be
    fully accessible, and we are working on them:
  </p>
  <ul>
    <li>
      Content provided by third parties — such as embedded maps, videos, or booking tools — is
      outside our direct control, and its accessibility depends on the provider.
    </li>
    <li>
      Some older documents and media published before this statement may not yet meet the standard.
      If you need one of them in an accessible format, ask us and we will provide it.
    </li>
    <li>
      Automated testing cannot catch every issue. Some problems are only found by people using the
      site, which is why the feedback route below matters to us.
    </li>
  </ul>

  <h2>Tell us about a problem</h2>
  <p>
    If you encounter a barrier on this site, or you need information from it in a different format,
    please tell us. We want to know, and we will help.
  </p>
  <p>
    Email <a href="mailto:{contact}">{contact}</a>{#if legal.contactPhone} or call
      <a href="tel:{legal.contactPhone.replace(/[^+0-9]/g, '')}">{legal.contactPhone}</a>{/if}.
  </p>
  <p>
    Please tell us the page you were on and what went wrong.
    <strong>We aim to acknowledge every accessibility message within 2 business days</strong> and to give
    you a substantive response, including a plan and timescale for any fix, within 10 business days. If
    you need the information urgently, say so and we will prioritise it.
  </p>

  <h2>Assessment approach</h2>
  <p>
    This site is assessed by automated testing integrated into our deployment process, supplemented
    by manual review. Automated testing reliably covers only a portion of the WCAG success criteria,
    so we do not claim it is sufficient on its own — feedback from people using the site is a
    genuine part of how we find problems.
  </p>
</LegalPage>
