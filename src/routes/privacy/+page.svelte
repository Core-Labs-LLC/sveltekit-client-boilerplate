<script>
  // Privacy policy. Content is generated from src/lib/legal/site.js — edit the
  // facts there, not the prose here, so the policy can't drift out of sync with
  // what the site actually does.
  //
  // The `trackers` branch matters: an empty list lets this page truthfully say
  // the site does no tracking and no cross-context behavioral advertising,
  // which is the strongest and cheapest privacy posture available. Only add a
  // tracker when a client genuinely requires one, and route it through the
  // consent gate when you do.
  import LegalPage from '$lib/components/LegalPage.svelte'
  import { legal, formattedAddress } from '$lib/legal/site.js'

  const tracked = legal.trackers.length > 0
</script>

<svelte:head>
  <title>Privacy Policy | {legal.tradeName}</title>
  <meta
    name="description"
    content="How {legal.tradeName} collects, uses, and protects the personal information you share through this website."
  />
  <link rel="canonical" href="{legal.siteUrl}/privacy" />
  <meta property="og:title" content="Privacy Policy | {legal.tradeName}" />
  <meta
    property="og:description"
    content="How {legal.tradeName} collects, uses, and protects the personal information you share through this website."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{legal.siteUrl}/privacy" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Privacy Policy | {legal.tradeName}" />
  <meta
    name="twitter:description"
    content="How {legal.tradeName} collects, uses, and protects the personal information you share through this website."
  />
</svelte:head>

<LegalPage
  title="Privacy Policy"
  intro="This policy explains what personal information {legal.tradeName} collects through this website, why we collect it, and the choices you have."
>
  <h2>Who we are</h2>
  <p>
    This website is operated by {legal.entityName} ("we", "us", "our"), {formattedAddress()}. You can
    reach us about anything in this policy at
    <a href="mailto:{legal.contactEmail}">{legal.contactEmail}</a>{#if legal.contactPhone}
      or <a href="tel:{legal.contactPhone.replace(/[^+0-9]/g, '')}">{legal.contactPhone}</a>{/if}.
  </p>

  <h2>Information we collect</h2>
  <p>We collect only what we need to answer you and run this website:</p>
  <ul>
    <li>
      <strong>Information you give us.</strong> When you submit a form on this site, we receive what
      you typed into it — typically your name, email address{#if legal.collectsPhone}, phone
        number{/if}, and your message. We also record the date and time of the submission, the page
      it came from, your IP address, and your browser's user agent, so we can verify a submission
      is genuine and respond to it.
    </li>
    <li>
      <strong>Information collected automatically.</strong> Our hosting provider keeps standard
      server logs — IP address, browser type, pages requested, and timestamps — for security and to
      keep the site running. These logs are not used to build a profile of you.
    </li>
    <li>
      <strong>Spam protection.</strong> Forms on this site are protected by hCaptcha, which analyzes
      the interaction to tell humans from bots. hCaptcha's own
      <a href="https://www.hcaptcha.com/privacy" rel="noopener noreferrer" target="_blank"
        >privacy policy</a
      > applies to that processing.
    </li>
  </ul>

  <h2>Cookies and tracking</h2>
  {#if tracked}
    <p>
      This site uses cookies and similar technologies that are strictly necessary to make it work,
      and — only after you agree — the following non-essential services:
    </p>
    <ul>
      {#each legal.trackers as tracker}
        <li>
          <strong>{tracker.name}</strong> — {tracker.purpose}.{#if tracker.policyUrl}
            <a href={tracker.policyUrl} rel="noopener noreferrer" target="_blank">Privacy policy</a
            >.{/if}
        </li>
      {/each}
    </ul>
    <p>
      These services do not load until you accept them, and you can change your choice at any time
      using the cookie preferences control on this site. Declining does not affect your ability to
      use the site or contact us.
    </p>
  {:else}
    <p>
      <strong
        >We do not use advertising cookies, analytics cookies, tracking pixels, or session-recording
        tools on this website.</strong
      >
      There is no third-party advertising network, social media pixel, or behavioral profiling
      running here. The only cookies this site may set are the ones strictly necessary to serve the
      pages and keep forms secure.
    </p>
    <p>
      Because we do not track you across sites, we have nothing to share with advertisers, and there
      is no cross-context behavioral advertising to opt out of.
    </p>
  {/if}

  <h2>How we use your information</h2>
  <ul>
    <li>To respond to your enquiry and provide the services you asked about.</li>
    {#if legal.collectsPhone}
      <li>
        To contact you by phone or text message about your enquiry, where you have given us your
        number and agreed to be contacted that way. You can withdraw that consent at any time by
        replying STOP to a text message or telling us in writing.
      </li>
    {/if}
    <li>To keep records of our communications with you.</li>
    <li>To protect the site against spam, abuse, and security threats.</li>
    <li>To meet our legal and accounting obligations.</li>
  </ul>
  <p>We do not sell your personal information, and we never have.</p>

  <h2>Who we share it with</h2>
  <p>
    We share personal information only with the service providers that make this website and our
    business run, and only so far as they need it to do their job:
  </p>
  <ul>
    <li><strong>Website hosting</strong> — to serve these pages and keep security logs.</li>
    <li><strong>Form processing and email delivery</strong> — to deliver your message to us.</li>
    <li><strong>Spam protection</strong> — hCaptcha, as described above.</li>
    <li>
      <strong>Our web services provider</strong> — Core Labs, which builds and maintains this site
      and may access submissions in the course of supporting it.
    </li>
  </ul>
  <p>
    We may also disclose information if the law requires it, or to establish or defend a legal
    claim. We do not sell or rent your information to anyone.
  </p>

  <h2>How long we keep it</h2>
  <p>
    We keep form submissions for as long as we need them to respond to you and to keep a record of
    the enquiry, and then for as long as any legal or accounting obligation requires. Server logs
    are kept for a short period for security purposes. If you would like your information deleted
    sooner, ask us and we will do it unless we are required to keep it.
  </p>

  <h2>Your choices and rights</h2>
  <p>You can ask us at any time to:</p>
  <ul>
    <li>tell you what personal information we hold about you;</li>
    <li>correct it if it is wrong;</li>
    <li>delete it; or</li>
    <li>stop contacting you.</li>
  </ul>
  <p>
    Email <a href="mailto:{legal.contactEmail}">{legal.contactEmail}</a> and we will respond. We
    will not treat you differently for exercising any of these rights. Depending on where you live,
    you may have additional rights under your state or national privacy law — tell us and we will
    honour them.
  </p>

  <h2>Children</h2>
  <p>
    This website is not directed at children under 13, and we do not knowingly collect personal
    information from them. If you believe a child has given us information, contact us and we will
    delete it.
  </p>

  <h2>Security</h2>
  <p>
    This site is served over an encrypted connection, and we take reasonable measures to protect the
    information you send us. No method of transmission over the internet is completely secure, so we
    cannot guarantee absolute security.
  </p>

  <h2>Links to other sites</h2>
  <p>
    Our site may link to websites we do not control. This policy does not apply to them, and we are
    not responsible for their content or privacy practices.
  </p>

  <h2>Changes to this policy</h2>
  <p>
    If we change this policy we will update the effective date at the top of this page. Material
    changes will be made clear on the site.
  </p>

  <h2>Contact us</h2>
  <p>
    {legal.entityName}<br />
    {formattedAddress()}<br />
    <a href="mailto:{legal.contactEmail}">{legal.contactEmail}</a>{#if legal.contactPhone}<br
      />{legal.contactPhone}{/if}
  </p>
</LegalPage>
