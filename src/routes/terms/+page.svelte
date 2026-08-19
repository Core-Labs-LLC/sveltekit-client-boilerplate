<script>
  // Terms of Use — liability limits and acceptable use only. Deliberately NO
  // arbitration clause and NO class-action waiver: a browsewrap arbitration
  // clause on a brochure site is weakly enforceable and sets a heavier tone
  // than these clients want. If a client ever needs one, it has to be paired
  // with a clickwrap agreement at each form, not just this page.
  import LegalPage from '$lib/components/LegalPage.svelte'
  import { legal, formattedAddress } from '$lib/legal/site.js'
</script>

<svelte:head>
  <title>Terms of Use | {legal.tradeName}</title>
  <meta
    name="description"
    content="The terms that apply when you use the {legal.tradeName} website."
  />
  <link rel="canonical" href="{legal.siteUrl}/terms" />
  <meta property="og:title" content="Terms of Use | {legal.tradeName}" />
  <meta
    property="og:description"
    content="The terms that apply when you use the {legal.tradeName} website."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{legal.siteUrl}/terms" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Terms of Use | {legal.tradeName}" />
  <meta
    name="twitter:description"
    content="The terms that apply when you use the {legal.tradeName} website."
  />
</svelte:head>

<LegalPage
  title="Terms of Use"
  intro="These terms apply when you use the {legal.tradeName} website. Please read them."
>
  <h2>Agreement to these terms</h2>
  <p>
    This website is operated by {legal.entityName} ("we", "us", "our"). By accessing or using the
    site, you agree to these Terms of Use. If you do not agree with them, please do not use the
    site.
  </p>

  <h2>Using this site</h2>
  <p>You agree not to:</p>
  <ul>
    <li>use the site for any unlawful purpose, or in a way that could damage or disable it;</li>
    <li>
      attempt to gain unauthorised access to any part of the site, its servers, or any connected
      system;
    </li>
    <li>
      use any automated system to scrape, harvest, or collect content or personal information from
      the site;
    </li>
    <li>submit false information, or impersonate another person, through any form on the site;</li>
    <li>introduce malware or any other harmful code.</li>
  </ul>

  <h2>Information on this site</h2>
  <p>
    We work to keep the information on this site accurate and current, but we make no promise that
    it is complete, accurate, or up to date at any given moment. Nothing on this site is intended as
    professional advice for your particular situation, and you should not rely on it as a substitute
    for advice from a qualified professional. Prices, availability, and service descriptions may
    change without notice.
  </p>

  <h2>Intellectual property</h2>
  <p>
    The content of this site — including text, graphics, logos, images, and layout — belongs to {legal.entityName}
    or its licensors and is protected by copyright and trademark law. You may view and print pages for
    your own reference. You may not reproduce, republish, or use the content commercially without our
    written permission.
  </p>

  <h2>Links to other websites</h2>
  <p>
    This site may link to websites operated by others. We provide those links for convenience only.
    We do not control those sites, do not endorse them, and are not responsible for their content,
    products, or practices. Visiting them is at your own risk.
  </p>

  <h2>Disclaimer of warranties</h2>
  <p>
    This site is provided "as is" and "as available", without warranties of any kind, whether
    express or implied. To the fullest extent permitted by law, we disclaim all implied warranties,
    including any implied warranty of merchantability, fitness for a particular purpose, and
    non-infringement. We do not warrant that the site will be uninterrupted, secure, or error-free,
    or that any defect will be corrected.
  </p>

  <h2>Limitation of liability</h2>
  <p>
    To the fullest extent permitted by law, {legal.entityName} and its owners, employees, and agents
    will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive
    damages, or for any loss of profits, revenue, data, or goodwill, arising out of or relating to
    your use of — or inability to use — this site, whether based in contract, tort, negligence,
    strict liability, or any other legal theory, and whether or not we were advised of the
    possibility of such damages.
  </p>
  <p>
    To the fullest extent permitted by law, our total liability for all claims relating to the site
    will not exceed one hundred US dollars ($100). Some jurisdictions do not allow the exclusion or
    limitation of certain damages, so parts of this section may not apply to you; in that case our
    liability is limited to the smallest extent permitted by law.
  </p>

  <h2>Indemnification</h2>
  <p>
    You agree to indemnify and hold harmless {legal.entityName} and its owners, employees, and
    agents from any claim, demand, loss, or expense (including reasonable legal fees) arising out of
    your misuse of the site or your breach of these terms.
  </p>

  <h2>Privacy</h2>
  <p>
    Our <a href="/privacy">Privacy Policy</a> explains how we handle personal information you send
    through this site, and forms part of these terms.
  </p>

  <h2>Governing law</h2>
  <p>
    These terms are governed by the laws of the State of {legal.governingState}, without regard to
    its conflict-of-laws rules. Any dispute relating to these terms or to this site will be brought
    in the state or federal courts located in {legal.governingState}, and you consent to the
    jurisdiction of those courts.
  </p>

  <h2>Changes to these terms</h2>
  <p>
    We may update these terms from time to time. When we do, we will change the effective date at
    the top of this page. Continuing to use the site after a change means you accept the updated
    terms.
  </p>

  <h2>Severability</h2>
  <p>
    If any part of these terms is found unenforceable, the rest remains in full effect, and the
    unenforceable part will be applied to the greatest extent the law allows.
  </p>

  <h2>Contact us</h2>
  <p>
    {legal.entityName}<br />
    {formattedAddress()}<br />
    <a href="mailto:{legal.contactEmail}">{legal.contactEmail}</a>
  </p>
</LegalPage>
